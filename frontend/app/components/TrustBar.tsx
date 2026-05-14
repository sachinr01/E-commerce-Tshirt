export default function TrustBar() {
  const features = [
    {
      icon: "fa-refresh",
      title: "Easy returns",
      desc: "Return within 15 days of order delivery.",
    },
    {
      icon: "fa-truck",
      title: "We ship worldwide",
      desc: "Fast and reliable international delivery.",
    },
    {
      icon: "fa-clock-o",
      title: "Free shipping",
      desc: "Free shipping on orders above Rs 1,000.",
    },
    {
      icon: "fa-certificate",
      title: "Cash on delivery",
      desc: "COD available.",
    },
  ];

  return (
    <div className="tb-wrap">
      <div className="tb-tagline">
        <h6>Trend-Driven Design. Quality-First Craftsmanship.</h6>
      </div>
      <div className="tb-grid">
        {features.map((f, i) => (
          <div key={i} className="tb-item">
            <div className="tb-icon">
              <i className={`fa ${f.icon}`} aria-hidden="true" />
            </div>
            <div className="tb-text">
              <h4>{f.title}</h4>
              <h6>{f.desc}</h6>
            </div>
          </div>
        ))}
      </div>
      <div className="tb-stripe-bar" />
    </div>
  );
}
