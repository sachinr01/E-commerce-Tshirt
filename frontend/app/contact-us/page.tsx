import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./contact-us.css";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "NESTCASE";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

export const metadata: Metadata = {
  title: `Contact Us | ${SITE_NAME}`,
  description:
    "Contact Nestcase for product queries, order support, business enquiries, bulk orders, gifting and collaborations.",
  alternates: { canonical: `${SITE_URL}/contact-us` },
};

const supportItems = [
  {
    label: "Email",
    value: "support@nestcase.in",
    href: "mailto:support@nestcase.in",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
        <path d="M4.2 7.2 12 13.1l7.8-5.9" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    value: "+91 98765 43210",
    href: "https://wa.me/919876543210",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.7 18.2 4 19l.8-2.6A7.8 7.8 0 1 1 6.7 18.2z" />
        <path d="M9.2 8.3c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.6 1.4c.1.2.1.4-.1.6l-.4.5c.7 1.3 1.7 2.2 3 2.9l.6-.7c.1-.2.3-.2.6-.1l1.4.6c.3.1.4.3.4.6 0 .9-.8 1.6-1.7 1.6-2.5 0-6.9-3.5-6.9-6.2 0-.3.2-.6.3-.8z" />
      </svg>
    ),
  },
  {
    label: "Business Hours",
    value: (
      <>
        Monday - Saturday
        <br />
        10:00 AM - 7:00 PM
      </>
    ),
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5v5l3.2 2" />
      </svg>
    ),
  },
];

const socialItems = [
  {
    label: "Instagram",
    value: "@nestcase.in",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5" y="5" width="14" height="14" rx="4" />
        <circle cx="12" cy="12" r="3.1" />
        <path d="M16.3 7.7h.01" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    value: "nestcase",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.5 10v8" />
        <path d="M10.5 18v-8" />
        <path d="M10.5 13.4c0-2.1 1.3-3.5 3.2-3.5 2 0 3.3 1.4 3.3 3.8V18" />
        <path d="M6.5 7h.01" />
        <rect x="4" y="4" width="16" height="16" rx="2.4" />
      </svg>
    ),
  },
  {
    label: "Pinterest",
    value: "@nestcase.in",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M10.4 18.8 12 12.2" />
        <path d="M12.1 14.3c2.2.8 4.4-.7 4.4-3.2 0-2.4-1.8-4.2-4.4-4.2-3.1 0-4.9 2.1-4.9 4.5 0 1.3.6 2.4 1.6 2.8" />
        <circle cx="12" cy="12" r="8.5" />
      </svg>
    ),
  },
];

function ContactIcon({ children }: { children: React.ReactNode }) {
  return <span className="contact-icon">{children}</span>;
}

export default function ContactUsPage() {
  return (
    <div className="contact-page">
      <Header />
      <main className="contact-main">
        <section className="contact-hero" aria-labelledby="contact-title">
          <h1 id="contact-title">Contact Us</h1>
          <span aria-hidden="true" />
          <p>
            We&apos;d love to hear from you.
            <br />
            For product queries, order support, or business enquiries - our team is here to help.
          </p>
        </section>

        <section className="contact-layout" aria-label="Contact details and enquiry form">
          <div className="contact-info">
            <section className="contact-block">
              <h2>Customer Support</h2>
              <div className="contact-rule" />
              <div className="contact-stack">
                {supportItems.map((item) => (
                  <div className="contact-row" key={item.label}>
                    <ContactIcon>{item.icon}</ContactIcon>
                    <div>
                      <h3>{item.label}</h3>
                      {"href" in item && item.href ? (
                        <a href={item.href}>{item.value}</a>
                      ) : (
                        <p>{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="contact-block contact-divider">
              <h2>Business &amp; B2B Enquiries</h2>
              <div className="contact-rule" />
              <p className="contact-copy">
                For bulk orders, gifting, hospitality
                <br />
                partnerships, or collaborations:
              </p>
              <a className="contact-email" href="mailto:business@nestcase.in">
                business@nestcase.in
              </a>
            </section>

            <section className="contact-block contact-divider">
              <h2>Address</h2>
              <div className="contact-rule" />
              <div className="contact-row">
                <ContactIcon>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 21s6-5.9 6-11a6 6 0 0 0-12 0c0 5.1 6 11 6 11z" />
                    <circle cx="12" cy="10" r="2" />
                  </svg>
                </ContactIcon>
                <p>
                  nestcase
                  <br />
                  Pune, Maharashtra
                  <br />
                  India
                </p>
              </div>
            </section>

            <section className="contact-block contact-divider">
              <h2>Socials</h2>
              <div className="contact-rule" />
              <div className="contact-stack contact-socials">
                {socialItems.map((item) => (
                  <div className="contact-row" key={item.label}>
                    <ContactIcon>{item.icon}</ContactIcon>
                    <div>
                      <h3>{item.label}</h3>
                      <p>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="contact-block contact-divider">
              <h2>Response Time</h2>
              <div className="contact-rule" />
              <div className="contact-row">
                <ContactIcon>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 8H4V5" />
                    <path d="M4.7 8A8 8 0 1 1 4 12" />
                    <path d="M11 9v4l3 1.8" />
                  </svg>
                </ContactIcon>
                <p>
                  We usually respond within
                  <br />
                  24-48 business hours.
                </p>
              </div>
            </section>
          </div>

          <section className="contact-form-section" aria-labelledby="connect-title">
            <h2 id="connect-title">Let&apos;s Connect</h2>
            <div className="contact-rule" />
            <p>
              Have a question or requirement?
              <br />
              Fill out the form below and our team will get
              <br />
              in touch with you.
            </p>
            <form className="contact-form">
              <label>
                <span>Name</span>
                <input type="text" name="name" placeholder="Name" />
              </label>
              <label>
                <span>Email Address</span>
                <input type="email" name="email" placeholder="Email Address" />
              </label>
              <label>
                <span>Phone Number</span>
                <input type="tel" name="phone" placeholder="Phone Number" />
              </label>
              <label>
                <span>Message</span>
                <textarea name="message" placeholder="Message" />
              </label>
              <button type="button">Send Message</button>
            </form>
          </section>
        </section>
      </main>

      <Footer />
    </div>
  );
}
