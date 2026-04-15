export type Blog = {
  slug: string;
  image: string;
  date: string;
  title: string;
  summary: string;
  content: string;
};

export const staticBlogs: Blog[] = [
  {
    slug: 'the-psychology-of-branding',
    image: '/store/images/posts/post-6.jpg',
    date: '09 Sept 2014',
    title: 'The Psychology of Branding',
    summary: 'How color, shape, and consistency build trust and recall.',
    content: '<p>Great brands feel familiar before we can explain why. Color, typography, and tone create a memory loop that shapes trust.</p><p>This post breaks down the small signals that make a brand feel premium and consistent.</p>',
  },
  {
    slug: 'the-quiet-power-of-minimalism',
    image: '/store/images/posts/post-7.jpg',
    date: '14 Sept 2014',
    title: 'The Quiet Power of Minimalism',
    summary: 'Why fewer elements often create stronger focus and conversions.',
    content: '<p>Minimalism is not emptiness. It is intentional space that guides attention.</p><p>Learn how to prioritize content so the story feels clean and effortless.</p>',
  },
  {
    slug: 'coffee-rituals-at-home',
    image: '/store/images/posts/post-8.jpg',
    date: '20 Sept 2014',
    title: 'Coffee Rituals at Home',
    summary: 'A simple routine that makes every morning feel intentional.',
    content: '<p>Small rituals create big moments. Start with fresh beans, warm cups, and a steady pour.</p><p>Your kitchen can feel like a quiet cafe with a few mindful steps.</p>',
  },
  {
    slug: 'layered-textures-in-modern-spaces',
    image: '/store/images/posts/post-7.jpg',
    date: '27 Sept 2014',
    title: 'Layered Textures in Modern Spaces',
    summary: 'How to mix linen, wood, and ceramics without visual noise.',
    content: '<p>Texture adds warmth to clean lines. Combine matte and gloss, smooth and rough.</p><p>Balance is the secret to a calm, collected room.</p>',
  },
  {
    slug: 'gift-ready-table-styling',
    image: '/store/images/posts/post-6.jpg',
    date: '03 Oct 2014',
    title: 'Gift-Ready Table Styling',
    summary: 'Quick upgrades that turn a simple table into a celebration.',
    content: '<p>Use a neutral base, then add a single bold color. Keep the centerpiece low.</p><p>Guests remember the glow, not the clutter.</p>',
  },
];

export function getStaticBlogBySlug(slug: string): Blog | undefined {
  const normalized = (slug || '').toString().trim().toLowerCase();
  const cleaned = normalized.split('/').filter(Boolean).pop() ?? '';
  return staticBlogs.find((b) => b.slug.toLowerCase() === cleaned);
}
