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
    <>
      <style>{`
        .gw-section {
          padding: 24px 0;
          background: #fff;
        }
        .gw-title {
          text-align: center;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #111;
          margin: 0 0 32px;
        }
        .gw-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          max-width: 1360px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .gw-panel {
          position: relative;
          overflow: hidden;
          aspect-ratio: 3 / 4;
          background: #f3f3f3;
        }
        .gw-panel img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          transition: transform 0.5s ease;
        }
        .gw-panel:hover img {
          transform: scale(1.03);
        }
        .gw-panel-label {
          position: absolute;
          bottom: 20px;
          left: 0;
          right: 0;
          text-align: center;
        }
        .gw-panel-link {
          display: inline-block;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #fff;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        @media (max-width: 768px) {
          .gw-section { padding: 40px 20px; }
          .gw-grid { gap: 10px; }
          .gw-title { font-size: 15px; margin-bottom: 24px; }
        }
        @media (max-width: 480px) {
          .gw-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <section className="gw-section">
        <h2 className="gw-title">GIFTING</h2>
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
    </>
  );
}
