import Link from 'next/link';

const panels = [
  {
    image: '/store/images/CORPORATE_GIFTING.jpg',
    label: 'CORPORATE GIFTING',
    href: '/#',
  },
  {
    image: '/store/images/E-CARDS.jpg',
    label: 'SHOP E-CARDS',
    href: '/#',
  },
];

export default function GiftingWorld() {
  return (
    <section className="gw-section">
        <h3 className="gw-title">NESTCASE GIFTING</h3>
        <div className="gw-grid">
          {panels.map((p, i) => (
            <Link key={i} href={p.href} className="gw-panel">
              <img src={p.image} alt={p.label} loading="lazy" />
              <div className="gw-panel-label">
                <span className="gw-panel-link">{p.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
  );
}
