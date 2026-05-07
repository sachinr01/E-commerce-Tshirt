import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PdfDownloadButton from './PdfDownloadButton';
import './footepages.css';

type StaticPage = {
  slug: string;
  title: string;
  content: string;
  summary: string;
  date: string;
  image?: string | null;
  seo_meta_title?: string | null;
  seo_meta_description?: string | null;
  seo_canonical_tag?: string | null;
  seo_meta_index?: string | null;
};

type PageResult = { page?: StaticPage; error?: 'api' | 'not-found' };

const normalizeText = (value: string) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const BASE_URL =
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'http://localhost:3001';

const normalizeHeading = (value: string) =>
  normalizeText(
    String(value || '')
      .replace(/&amp;/g, '&')
      .replace(/&nbsp;/g, ' ')
      .replace(/<[^>]+>/g, ' ')
  );

const extractFirstHeading = (html: string) => {
  const match = String(html || '').match(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i);
  return match ? normalizeHeading(match[1]) : '';
};

const shouldHideHeroTitle = (pageTitle: string, html: string) => {
  const title = normalizeHeading(pageTitle);
  if (!title) return false;
  return extractFirstHeading(html) === title;
};

const parseFontSize = (style: string | undefined, fallback = 26) => {
  const match = String(style || '').match(/font-size\s*:\s*([\d.]+)px/i);
  return match ? Number(match[1]) || fallback : fallback;
};

const iconSvg = (icon: string, size: number) => {
  const common = `width:${size}px;height:${size}px;display:block;color:#2a2a2a;`;
  switch (icon) {
    case 'fa-truck':
      return `<svg aria-hidden="true" viewBox="0 0 24 24" style="${common}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h11v8H3z"/><path d="M14 10h4l3 3v2h-7z"/><path d="M7.5 18a1.8 1.8 0 1 0 0 .01z"/><path d="M17 18a1.8 1.8 0 1 0 0 .01z"/></svg>`;
    case 'fa-box-open':
      return `<svg aria-hidden="true" viewBox="0 0 24 24" style="${common}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9l8-4 8 4-8 4-8-4z"/><path d="M4 9v7l8 4 8-4V9"/><path d="M12 13v7"/></svg>`;
    case 'fa-clock':
      return `<svg aria-hidden="true" viewBox="0 0 24 24" style="${common}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 8v5l3 2"/></svg>`;
    case 'fa-clipboard-list':
      return `<svg aria-hidden="true" viewBox="0 0 24 24" style="${common}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="5" width="12" height="15" rx="1.5"/><path d="M9 5.5V4h6v1.5"/><path d="M8.5 10h7"/><path d="M8.5 13h7"/><path d="M8.5 16h5"/></svg>`;
    case 'fa-circle-xmark':
      return `<svg aria-hidden="true" viewBox="0 0 24 24" style="${common}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M9 9l6 6"/><path d="M15 9l-6 6"/></svg>`;
    case 'fa-shield-halved':
      return `<svg aria-hidden="true" viewBox="0 0 24 24" style="${common}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l6 2v4c0 4.6-2.7 7.8-6 10-3.3-2.2-6-5.4-6-10V5l6-2z"/><path d="M12 3v16"/></svg>`;
    case 'fa-location-dot':
      return `<svg aria-hidden="true" viewBox="0 0 24 24" style="${common}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s5-5.3 5-10a5 5 0 1 0-10 0c0 4.7 5 10 5 10z"/><circle cx="12" cy="11" r="1.8" fill="currentColor" stroke="none"/></svg>`;
    case 'fa-box':
      return `<svg aria-hidden="true" viewBox="0 0 24 24" style="${common}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8l8-4 8 4-8 4-8-4z"/><path d="M4 8v8l8 4 8-4V8"/><path d="M12 12v8"/></svg>`;
    case 'fa-rotate-left':
    case 'fa-arrows-rotate':
      return `<svg aria-hidden="true" viewBox="0 0 24 24" style="${common}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 0 1 13.66-5.66L20 8"/><path d="M20 4v4h-4"/><path d="M20 12a8 8 0 0 1-13.66 5.66L4 16"/><path d="M4 20v-4h4"/></svg>`;
    case 'fa-credit-card':
      return `<svg aria-hidden="true" viewBox="0 0 24 24" style="${common}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/><path d="M7 15h4"/></svg>`;
    case 'fa-bag-shopping':
      return `<svg aria-hidden="true" viewBox="0 0 24 24" style="${common}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12l-1 11H7L6 8z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>`;
    case 'fa-circle-user':
      return `<svg aria-hidden="true" viewBox="0 0 24 24" style="${common}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="3"/><path d="M5 20c1.4-3.1 4-4.5 7-4.5s5.6 1.4 7 4.5"/></svg>`;
    case 'fa-user':
      return `<svg aria-hidden="true" viewBox="0 0 24 24" style="${common}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c1.6-3.4 4.2-5 7-5s5.4 1.6 7 5"/></svg>`;
    case 'fa-users':
      return `<svg aria-hidden="true" viewBox="0 0 24 24" style="${common}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="9" r="2.6"/><circle cx="16.5" cy="10" r="2.2"/><path d="M3.5 20c1-2.8 3.1-4.1 5.5-4.1S13.5 17.2 14.5 20"/><path d="M13.3 19.8c.6-1.7 2.1-2.7 3.8-2.7 1.8 0 3.2 1 4 2.7"/></svg>`;
    case 'fa-cookie-bite':
      return `<svg aria-hidden="true" viewBox="0 0 24 24" style="${common}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4c-.6 1.8.4 3.3 2 4 .2 1.6 1.5 3 3 3.2-.2 3.6-3.2 6.8-6.9 6.8A6.9 6.9 0 1 1 12 4z"/><circle cx="9" cy="9" r=".7" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r=".7" fill="currentColor" stroke="none"/><circle cx="10" cy="15" r=".7" fill="currentColor" stroke="none"/></svg>`;
    case 'fa-paper-plane':
      return `<svg aria-hidden="true" viewBox="0 0 24 24" style="${common}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M22 3L11 14"/><path d="M22 3l-7 18-4-8-8-4 18-6z"/></svg>`;
    case 'fa-link':
      return `<svg aria-hidden="true" viewBox="0 0 24 24" style="${common}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14l4-4"/><path d="M7.5 16.5a4 4 0 0 1 0-5.7l2.3-2.3a4 4 0 0 1 5.7 0"/><path d="M16.5 7.5a4 4 0 0 1 0 5.7l-2.3 2.3a4 4 0 0 1-5.7 0"/></svg>`;
    case 'fa-file-lines':
      return `<svg aria-hidden="true" viewBox="0 0 24 24" style="${common}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/><path d="M9 12h6"/><path d="M9 15h6"/><path d="M9 18h6"/></svg>`;
    case 'fa-triangle-exclamation':
      return `<svg aria-hidden="true" viewBox="0 0 24 24" style="${common}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4l8 14H4L12 4z"/><path d="M12 9v4"/><path d="M12 16h.01"/></svg>`;
    case 'fa-globe':
      return `<svg aria-hidden="true" viewBox="0 0 24 24" style="${common}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M4 12h16"/><path d="M12 4c2.2 2.5 3.4 5.3 3.4 8S14.2 17.5 12 20c-2.2-2.5-3.4-5.3-3.4-8S9.8 6.5 12 4z"/></svg>`;
    case 'fa-envelope':
      return `<svg aria-hidden="true" viewBox="0 0 24 24" style="${common}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="6" width="16" height="12" rx="1.5"/><path d="M4 8l8 6 8-6"/></svg>`;
    case 'fa-wallet':
      return `<svg aria-hidden="true" viewBox="0 0 24 24" style="${common}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="6" width="16" height="12" rx="2"/><path d="M16 11h4v4h-4"/><circle cx="17.5" cy="13" r="0.8" fill="currentColor" stroke="none"/></svg>`;
    case 'fa-copyright':
      return `<svg aria-hidden="true" viewBox="0 0 24 24" style="${common}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M14.8 10.4a3.2 3.2 0 1 0 0 3.2"/></svg>`;
    case 'fa-lock':
      return `<svg aria-hidden="true" viewBox="0 0 24 24" style="${common}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V8a4 4 0 0 1 8 0v2"/><path d="M12 14v2"/></svg>`;
    case 'fa-scale-balanced':
      return `<svg aria-hidden="true" viewBox="0 0 24 24" style="${common}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v16"/><path d="M6 7h12"/><path d="M9 7l-3 6h6l-3-6z"/><path d="M15 7l-3 6h6l-3-6z"/><path d="M5 20h14"/></svg>`;
    default:
      return '';
  }
};

const replaceFontAwesomeIcons = (html: string) =>
  String(html || '').replace(/<i\b([^>]*)class="([^"]*)"([^>]*)><\/i>/gi, (match, before, classValue, after) => {
    const classes = String(classValue || '').split(/\s+/).filter(Boolean);
    const iconClass = classes.find((item) =>
      item.startsWith('fa-') &&
      !['fa-solid', 'fa-regular', 'fa-light', 'fa-thin', 'fa-duotone', 'fa-sharp', 'fa-brands', 'fa-classic', 'fa-fw', 'fa-li', 'fa-ul'].includes(item)
    );
    if (!iconClass) return match;

    const styleMatch = String(before || after || '').match(/style="([^"]*)"/i);
    const size = parseFontSize(styleMatch?.[1]);
    const svg = iconSvg(iconClass, size);
    return svg || match;
  });

const isDownloadablePolicyPage = (page: StaticPage | undefined, slug: string) => {
  const haystack = normalizeText(`${page?.slug || ''} ${page?.title || ''} ${slug}`);
  return (
    haystack.includes('privacy policy') ||
    haystack.includes('shipping policy') ||
    haystack.includes('refund') ||
    haystack.includes('return') ||
    (haystack.includes('terms') && haystack.includes('conditions'))
  );
};

const fetchPage = async (slug: string): Promise<PageResult> => {
  try {
    const res = await fetch(`${BASE_URL}/store/api/pages/slug/${slug}`, {
      cache: 'no-store',
    });
    if (res.status === 404) return { error: 'not-found' };
    if (!res.ok) return { error: 'api' };
    const data = await res.json();
    if (data?.success && data.data) return { page: data.data };
    return { error: 'not-found' };
  } catch {
    return { error: 'api' };
  }
};

// Lightweight fetch used only by generateMetadata in [slug]/page.tsx
export const fetchPageForMeta = async (slug: string): Promise<StaticPage | null> => {
  const result = await fetchPage(slug);
  return result.page ?? null;
};

export async function renderStaticPage(slug: string) {
  const result = await fetchPage(slug);

  if (result.error === 'api') {
    return (
      <>
        <Header />
        <div className="dima-main static-error-wrap">
          <h2>We&apos;re having trouble loading this page.</h2>
          <p>Please try again in a few minutes.</p>
        </div>
        <Footer />
      </>
    );
  }

  if (result.error === 'not-found' || !result.page) {
    notFound();
  }

  const page = result.page;
  const html = replaceFontAwesomeIcons(page?.content || '');
  const hideHeroTitle = shouldHideHeroTitle(page?.title || '', html);
  const showDownload = page ? isDownloadablePolicyPage(page, slug) : false;

  return (
    <>
      <Header />
      <div className="dima-main static-page">
        <div className="static-body static-body--wide">
          <nav className="static-breadcrumb">
            <Link href="/">Home</Link>
            <span>{'>'}</span>
            <span className="static-breadcrumb-current">{page?.title || 'Page'}</span>
          </nav>

          {!hideHeroTitle && <h1 className="static-title">{page?.title || 'Page'}</h1>}

          {page?.image && (
            <div className="static-page-image">
              <Image
                src={page.image}
                alt={page.title || 'Page image'}
                width={1200}
                height={520}
                priority
              />
            </div>
          )}

          {page?.summary && (
            <div className="static-summary">{page.summary}</div>
          )}

          <div className="static-content" dangerouslySetInnerHTML={{ __html: html }} />

          {showDownload && (
            <div className="static-actions">
              <PdfDownloadButton page={page} />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
