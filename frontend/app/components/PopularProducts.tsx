const collectionImages = [
  '/store/images/category_images/CC_TUMBLERS.png',
  '/store/images/category_images/CC_GLASSWARE.png',
  '/store/images/category_images/CC_KITCHEN_ORGANISERS.png',
  '/store/images/category_images/CC_TUMBLERS.png',
];

export default function CuratedGifting() {
  return (
    <section style={{ padding: '56px 0', background: '#fff' }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '0 45px' }}>
        <h1 className="collection-hero-title">Welcome to nestcase, where modern style meets local excellence.</h1>
        <h2 className="section-title" style={{ marginTop: '1px' }}>Our Collection</h2>
        <div className="collection-grid-2x2">
          {collectionImages.map((src, i) => (
            <div key={i} className="collection-grid-item">
              <img src={src} alt={`Collection ${i + 1}`} loading="lazy" />
            </div>
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