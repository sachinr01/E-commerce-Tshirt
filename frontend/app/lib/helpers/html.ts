const BLOCK_TAG_BREAKS = /<\/(p|div|li|ul|ol|h1|h2|h3|h4|h5|h6|br|section|article)>/gi;
const LIST_BLOCK_PATTERN = /<(ul|ol)([^>]*)>([\s\S]*?)<\/\1>/gi;
const LIST_ITEM_PATTERN = /<li\b[^>]*>([\s\S]*?)<\/li>/gi;

function basicSanitize(html: string): string {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<(iframe|object|embed|form|meta|link)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<(iframe|object|embed|form|meta|link)[^>]*\/?>/gi, '')
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, '')
    .replace(/\s(href|src)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi, ' $1="#"');
}

/**
 * Fixes invalid HTML where block elements (h1–h6, p, div, ul, ol, li, table…)
 * are wrapped inside inline elements (strong, em, b, i, span, a).
 *
 * The editor produces markup like:
 *   <strong><h4>Heading</h4></strong>
 *
 * Browsers auto-correct this by pulling the block tag *out* of the inline
 * wrapper, which silently closes <strong> early — the heading renders
 * without bold/weight and subsequent content loses its styling too.
 *
 * Strategy: for every inline wrapper that contains a block-level child,
 * copy the inline wrapper's attributes (class, style, etc.) directly onto
 * each block child, then remove the now-redundant inline wrapper.
 *
 * Example:
 *   <strong><h4>Title</h4></strong>
 *   → <h4><strong>Title</strong></h4>
 *
 * This runs only in a browser (DOMParser required); the server-side path
 * gets a lightweight regex fallback that strips the outer inline tags.
 */
const BLOCK_TAGS = new Set([
  'p','div','h1','h2','h3','h4','h5','h6',
  'ul','ol','li','table','thead','tbody','tr','th','td',
  'blockquote','figure','section','article','header','footer','main','aside',
]);
const INLINE_WRAPPERS = new Set(['strong','em','b','i','u','s','span','a','mark','small','sub','sup']);

function fixInvalidNestingDOM(root: HTMLElement): void {
  // Keep iterating until no more invalid nesting is found (handles nested cases)
  let changed = true;
  while (changed) {
    changed = false;
    root.querySelectorAll([...INLINE_WRAPPERS].join(',')).forEach((inline) => {
      const blockChildren = [...inline.children].filter(
        (child) => BLOCK_TAGS.has(child.tagName.toLowerCase())
      );
      if (blockChildren.length === 0) return;

      const parent = inline.parentNode;
      if (!parent) return;

      // For each block child: wrap its contents in a clone of the inline tag
      // (preserving attributes like class/style), then insert before the inline.
      blockChildren.forEach((blockEl) => {
        const inlineClone = inline.cloneNode(false) as HTMLElement; // shallow clone
        // Move all block children inside a fresh inline clone
        while (blockEl.firstChild) {
          inlineClone.appendChild(blockEl.firstChild);
        }
        blockEl.appendChild(inlineClone);
        parent.insertBefore(blockEl, inline);
      });

      // Move any remaining non-block content after the blocks
      while (inline.firstChild) {
        parent.insertBefore(inline.firstChild, inline);
      }
      inline.remove();
      changed = true;
    });
  }
}

/** Lightweight server-side fallback: just strip the outer inline tags. */
function fixInvalidNestingString(html: string): string {
  // Remove <strong>/<em>/etc. that immediately wraps a block tag
  return html
    .replace(/<(strong|em|b|i|u|s|span|mark|small)([^>]*)>\s*(<(?:h[1-6]|p|div|ul|ol|li|blockquote|table)[^>]*>)/gi, '$3')
    .replace(/(<\/(?:h[1-6]|p|div|ul|ol|li|blockquote|table)>)\s*<\/(?:strong|em|b|i|u|s|span|mark|small)>/gi, '$1');
}

function isLikelySpecLabel(text: string): boolean {
  const value = text.trim();
  if (!value || value.length > 40) return false;
  if (/[.!?]$/.test(value)) return false;
  return /[a-z]/i.test(value);
}

function normalizeLabel(labelHtml: string): string {
  const plainLabel = labelHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!plainLabel) return '';
  return /[:.]$/.test(plainLabel) ? plainLabel : `${plainLabel}:`;
}

function normalizeSpecListsInString(html: string): string {
  return html.replace(LIST_BLOCK_PATTERN, (fullMatch, tagName, attrs, innerHtml) => {
    const items = Array.from(
      innerHtml.matchAll(LIST_ITEM_PATTERN) as Iterable<RegExpMatchArray>,
      (match) => match[1].trim()
    );

    if (items.length < 4 || items.length % 2 !== 0) {
      return fullMatch;
    }

    const labelCount = items.filter((item, index) => index % 2 === 0 && isLikelySpecLabel(item.replace(/<[^>]+>/g, ' '))).length;
    if (labelCount < items.length / 2) {
      return fullMatch;
    }

    const normalizedItems = [];
    for (let index = 0; index < items.length; index += 2) {
      const label = normalizeLabel(items[index]);
      const value = items[index + 1];
      if (!label || !value) {
        return fullMatch;
      }
      normalizedItems.push(
        `<li class="oc-spec-item"><strong class="oc-spec-label">${label}</strong><span class="oc-spec-value">${value}</span></li>`
      );
    }

    return `<${tagName}${attrs} class="oc-spec-list">${normalizedItems.join('')}</${tagName}>`;
  });
}

function normalizeSpecListsInDocument(root: ParentNode) {
  root.querySelectorAll('ul, ol').forEach((list) => {
    const items = [...list.children].filter((child): child is HTMLLIElement => child.tagName === 'LI');

    if (items.length < 4 || items.length % 2 !== 0) {
      return;
    }

    const labelCount = items.filter((item, index) => index % 2 === 0 && isLikelySpecLabel(item.textContent || '')).length;
    if (labelCount < items.length / 2) {
      return;
    }

    const fragments: HTMLLIElement[] = [];
    for (let index = 0; index < items.length; index += 2) {
      const labelText = normalizeLabel(items[index].innerHTML);
      const valueHtml = items[index + 1].innerHTML.trim();
      if (!labelText || !valueHtml) {
        return;
      }

      const li = document.createElement('li');
      const strong = document.createElement('strong');
      const value = document.createElement('span');
      li.className = 'oc-spec-item';
      strong.className = 'oc-spec-label';
      value.className = 'oc-spec-value';
      strong.textContent = labelText;
      li.appendChild(strong);
      value.insertAdjacentHTML('beforeend', valueHtml);
      li.appendChild(value);
      fragments.push(li);
    }

    list.classList.add('oc-spec-list');
    list.replaceChildren(...fragments);
  });
}

type SanitizeHtmlOptions = {
  normalizeSpecLists?: boolean;
};

export function sanitizeHtml(
  html: string | null | undefined,
  options: SanitizeHtmlOptions = {}
): string {
  const { normalizeSpecLists = true } = options;
  const fixed = fixInvalidNestingString(basicSanitize(String(html || '')));
  const input = normalizeSpecLists
    ? normalizeSpecListsInString(fixed)
    : fixed;

  if (typeof window === 'undefined') {
    return input;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(input, 'text/html');

  // Fix invalid nesting (e.g. <strong><h4>…</h4></strong>) before any
  // other DOM work so downstream queries see valid structure.
  fixInvalidNestingDOM(doc.body as HTMLElement);

  doc.querySelectorAll('script, style, iframe, object, embed, form, meta, link, oembed').forEach((node) => {
    node.remove();
  });

  // Hide media embed figures (CKEditor oembed) — browser can't render them
  doc.querySelectorAll('figure.media').forEach((node) => {
    node.remove();
  });

  doc.querySelectorAll('*').forEach((element) => {
    [...element.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      const value = attr.value.trim().toLowerCase();

      if (name.startsWith('on')) {
        element.removeAttribute(attr.name);
        return;
      }

      if ((name === 'href' || name === 'src') && value.startsWith('javascript:')) {
        element.removeAttribute(attr.name);
      }
    });
  });

  if (normalizeSpecLists) {
    normalizeSpecListsInDocument(doc);
  }

  return doc.body.innerHTML;
}

export function htmlToText(html: string | null | undefined): string {
  const sanitized = sanitizeHtml(html)
    .replace(BLOCK_TAG_BREAKS, '$&\n')
    .replace(/<[^>]+>/g, ' ');

  return sanitized.replace(/\s+\n/g, '\n').replace(/\n\s+/g, '\n').replace(/[ \t]+/g, ' ').trim();
}