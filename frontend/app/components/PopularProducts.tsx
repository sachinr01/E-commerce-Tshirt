import Link from 'next/link';

const collectionImages = [
  { src: '/store/images/category_images/CC_TUMBLERS_NEW.png',  alt: 'drinkware',   href: '/shop/drinkware' },
  { src: '/store/images/category_images/CC_GLASSWARE.png', alt: 'glassware',  href: '/shop/glassware' },
  { src: '/store/images/category_images/CC_KITCHEN_ORGANISERS.png',   alt: 'Kitchen',    href: '/shop/jars-and-containers' },
  { src: '/store/images/category_images/CC_KITCHEN_ORGANISERS.png',alt: 'All in One', href: '/shop' },
];

export default function CuratedGifting() {
  return (
    <section style={{ padding: '30px 0', background: '#fff' }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '0 45px' }}>
        <h1 className="collection-hero-title">Welcome to nestcase, where modern style meets local excellence.</h1>
        <h2 className="section-title">Our Collection</h2>
        <div className="collection-grid-2x2">
          {collectionImages.map((item, i) => (
            <Link key={i} href={item.href} className="collection-grid-item">
              <img src={item.src} alt={item.alt} loading="lazy" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PopularCategories() {
  const popularCategories = [
    'https://icmedianew.gumlet.io/pub/media//home_banner/images/Best-Seller01-10.03.2026.jpg',
    'https://icmedianew.gumlet.io/pub/media//home_banner/images/Best-Seller02-10.03.2026.jpg',
    'https://icmedianew.gumlet.io/pub/media//home_banner/images/Best-Seller03-10.03.2026.jpg',
    'https://icmedianew.gumlet.io/pub/media//home_banner/images/Best-Seller04-10.03.2026.jpg',
  ];

  return (
    <section className="home-section" style={{ paddingTop: 0 }}>
      <h2 className="section-title">Popular Categories</h2>
      <div className="pop-cat-grid">
        {popularCategories.map((src, i) => (
          <div key={i} className="pop-cat-item">
            <img src={src} alt={`Category ${i + 1}`} />
          </div>
        ))}
      </div>
    </section>
  );
}