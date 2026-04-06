import type { Metadata } from 'next';
import ShopClient from '../shop/ShopClient';
import { getProducts, type Product } from '../lib/api';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001';
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'e-commerce';

async function fetchProducts(): Promise<Product[]> {
  try {
    return await getProducts();
  } catch {
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const products = await fetchProducts();

  const count = products.length;
  const inStock = products.filter((p) => p.stock_status === 'instock').length;

  const prices = products.map((p) => Number(p.price_min ?? 0)).filter((n) => n > 0);
  const minPrice = prices.length ? Math.min(...prices) : null;
  const maxPrice = prices.length ? Math.max(...prices) : null;
  const priceRange = minPrice && maxPrice
    ? ` Prices from Rs. ${minPrice.toFixed(0)} to Rs. ${maxPrice.toFixed(0)}.`
    : '';

  const title = count > 0
    ? `Collections | ${SITE_NAME}`
    : `Collections | ${SITE_NAME}`;

  const description = count > 0
    ? `Explore ${count} collection items${inStock < count ? ` (${inStock} in stock)` : ''}.${priceRange}`
    : 'Explore our full collection.';

  const keywordTokens = Array.from(new Set(
    products.flatMap((p) => [
      ...(p.slug ? p.slug.split('-') : []),
      ...p.title.split(/\s+/),
    ])
      .map((t) => t.toLowerCase().replace(/[^a-z0-9]+/g, ''))
      .filter((t) => t.length > 2),
  )).slice(0, 12);

  return {
    title,
    description,
    keywords: ['collection', 'collections', 'products', ...keywordTokens],
    alternates: { canonical: `${SITE_URL}/collection` },
    openGraph: { title, description, url: `${SITE_URL}/collection`, siteName: SITE_NAME, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: true, follow: true },
  };
}

export default async function CollectionPage() {
  const products = await fetchProducts();

  const heading = 'Categories';
  const subheading = '';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Collections', item: `${SITE_URL}/collection` },
        ],
      },
      ...(products.length > 0
        ? [{
            '@type': 'ItemList',
            name: 'Collections',
            numberOfItems: products.length,
            itemListElement: products.slice(0, 20).map((p, i) => {
              const slugBase = (p.slug || p.title)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');

              return {
                '@type': 'ListItem',
                position: i + 1,
                url: `${SITE_URL}/shop/product/${slugBase}`,
                name: p.title,
              };
            }),
          }]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ShopClient heading={heading} subheading={subheading} />
    </>
  );
}
