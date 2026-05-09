import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "NESTCASE";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

export const metadata: Metadata = {
  title: `B2B Connect | ${SITE_NAME}`,
  description:
    "Premium drinkware, glassware and lifestyle essentials for hospitality, gifting, retail and modern spaces.",
  alternates: { canonical: `${SITE_URL}/b2b-connect` },
};

const categories = [
  {
    title: "Glassware",
    image: "/store/images/b2b_images/Glassware.jpeg",
  },
  {
    title: "Drinkware",
    image: "/store/images/b2b_images/Drinkware.jpeg",
  },
  {
    title: "Kitchen Storage",
    image: "/store/images/b2b_images/Kitchen-Storage.jpeg",
  },
  {
    title: "Corporate Gifting",
    image: "/store/images/b2b_images/Corporate-Gifting.png",
  },
  {
    title: "Hospitality Essentials",
    image: "/store/images/b2b_images/Hospitality-Essentials.jpeg",
  },
];

const benefits = [
  {
    title: "Premium Quality",
    copy: "Finest materials and craftsmanship for lasting impressions.",
    iconClass: "fa-certificate",
  },
  {
    title: "Bulk Order Support",
    copy: "Flexible solutions for businesses of all sizes.",
    iconClass: "fa-cubes",
  },
  {
    title: "Custom Branding",
    copy: "Personalized options to reflect your brand identity.",
    iconClass: "fa-tag",
  },
  {
    title: "Reliable Delivery",
    copy: "Timely and secure delivery, every time.",
    iconClass: "fa-truck",
  },
];

export default function B2BConnectPage() {
  return (
    <>
      <Header />
      <main className="b2b-page">
        <div className="b2b-hero-art">
          <img src="/store/images/b2b_images/b2b-new-banner.jpeg" alt="new-banner" />
        </div>
        
        {/* <section className="b2b-hero" aria-labelledby="b2b-hero-title">
          <div className="b2b-hero-copy">
            <p className="b2b-eyebrow">B2B Connect</p>
            <h1 id="b2b-hero-title">Crafted for Modern Businesses</h1>
            <p className="b2b-hero-text">
              Premium glassware, drinkware & lifestyle essentials for
              hospitality, gifting, retail & modern spaces.
            </p>
            <a className="b2b-button" href="#b2b-contact">
              Get In Touch <span aria-hidden="true">-&gt;</span>
            </a>
          </div>
          <div className="b2b-hero-art" aria-hidden="true">
            <img
              src="/store/images/b2b_images/b2b-banner.png"
              alt=""
            />
          </div>
        </section> */}

        <section className="b2b-section b2b-categories" aria-labelledby="b2b-categories-title">
          <div className="b2b-section-heading">
            <p className="b2b-eyebrow">Explore Our Collections</p>
            <h2 id="b2b-categories-title">Our Product Categories</h2>
          </div>
          <div className="b2b-category-grid">
            {categories.map((category) => (
              <Link className="b2b-category-card" href="/shop" key={category.title}>
                <span className="b2b-category-image">
                  <img src={category.image} alt={category.title} />
                </span>
                <span className="b2b-category-name">
                  {category.title}
                  <span aria-hidden="true">-&gt;</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="b2b-quote-band" aria-label="Brand statement">
          <span />
          <p>Thoughtfully crafted products for spaces people remember.</p>
          <span />
        </section>

        <section className="b2b-section b2b-benefits" aria-labelledby="b2b-benefits-title">
          <div className="b2b-section-heading">
            <p className="b2b-eyebrow">Why Partner With Nestcase</p>
            <h2 id="b2b-benefits-title">Why Partner With Us?</h2>
          </div>
          <div className="b2b-benefit-grid">
            {benefits.map((benefit) => (
              <article className="b2b-benefit" key={benefit.title}>
                <div className="b2b-benefit-icon">
                  <i className={`fa ${benefit.iconClass}`} aria-hidden="true" />
                </div>
                <h3>{benefit.title}</h3>
                <p>{benefit.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="b2b-contact" id="b2b-contact" aria-labelledby="b2b-contact-title">
          <div className="b2b-leaf" aria-hidden="true" />
          <div className="b2b-contact-copy">
            <h2 id="b2b-contact-title">Let&apos;s Work Together</h2>
            <p>
              Share your business requirements and our team will get in touch
              with you.
            </p>
          </div>
          <form className="b2b-form">
            <div className="b2b-form-row">
              <label>
                <span>Your Name</span>
                <input type="text" name="name" placeholder="Your Name" />
              </label>
              <label>
                <span>Business Name</span>
                <input type="text" name="business" placeholder="Business Name" />
              </label>
            </div>
            <div className="b2b-form-row">
              <label>
                <span>Email Address</span>
                <input type="email" name="email" placeholder="Email Address" />
              </label>
              <label>
                <span>Phone Number</span>
                <input type="tel" name="phone" placeholder="Phone Number" />
              </label>
            </div>
            <label>
              <span>Requirements</span>
              <textarea name="requirements" placeholder="Tell us about your requirements" />
            </label>
            <button className="b2b-button" type="button">
              Request Callback <span aria-hidden="true">-&gt;</span>
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
