import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContactForm from "./ContactForm";

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
    iconClass: "fa-envelope",
  },
  {
    label: "WhatsApp",
    value: "+91 98765 43210",
    href: "https://wa.me/919876543210",
    iconClass: "fa-whatsapp",
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
    iconClass: "fa-clock-o",
  },
];

const socialItems = [
  {
    label: "Instagram",
    value: "@nestcase.in",
    iconClass: "fa-instagram",
  },
  {
    label: "LinkedIn",
    value: "nestcase",
    iconClass: "fa-linkedin",
  },
  {
    label: "Pinterest",
    value: "@nestcase.in",
    iconClass: "fa-pinterest",
  },
];

function ContactIcon({ iconClass }: { iconClass: string }) {
  return (
    <span className="contact-icon">
      <i className={`fa ${iconClass}`} aria-hidden="true" />
    </span>
  );
}

export default function ContactUsPage() {
  return (
    <div className="contact-page">
      <Header />
      <main className="contact-main">
        <section className="contact-hero" aria-labelledby="contact-title">
          <h2 id="contact-title">Contact Us</h2>
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
              <h3>Customer Support</h3>
              <div className="contact-rule" />
              <div className="contact-stack">
                {supportItems.map((item) => (
                  <div className="contact-row" key={item.label}>
                    <ContactIcon iconClass={item.iconClass} />
                    <div>
                      <h6>{item.label}</h6>
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
              <h3>Business &amp; B2B Enquiries</h3>
              <div className="contact-rule" />
              <p className="contact-copy">
                For bulk orders, gifting, hospitality partnerships, or collaborations:
              </p>
              <a className="contact-email" href="mailto:business@nestcase.in">
                business@nestcase.in
              </a>
            </section>

            <section className="contact-block contact-divider">
              <h3>Address</h3>
              <div className="contact-rule" />
              <div className="contact-row">
                <ContactIcon iconClass="fa-map-marker" />
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
              <h3>Socials</h3>
              <div className="contact-rule" />
              <div className="contact-stack contact-socials">
                {socialItems.map((item) => (
                  <div className="contact-row" key={item.label}>
                    <ContactIcon iconClass={item.iconClass} />
                    <div>
                      <h6>{item.label}</h6>
                      <p>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="contact-block contact-divider">
              <h3>Response Time</h3>
              <div className="contact-rule" />
              <div className="contact-row">
                <ContactIcon iconClass="fa-refresh" />
                <p>
                  We usually respond within
                  <br />
                  24-48 business hours.
                </p>
              </div>
            </section>
          </div>

          <section className="contact-form-section" aria-labelledby="connect-title">
            <h3 id="connect-title">Let&apos;s Connect</h3>
            <div className="contact-rule" />
            <p>
              Have a question or requirement?
              <br />
              Fill out the form below and our team will get in touch with you.
            </p>
            <ContactForm />
          </section>
        </section>
      </main>

      <Footer />
    </div>
  );
}
