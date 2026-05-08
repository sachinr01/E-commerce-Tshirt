import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./careers.css";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "NESTCASE";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

export const metadata: Metadata = {
  title: `Careers | ${SITE_NAME}`,
  description:
    "Explore career opportunities at Nestcase and connect with our team.",
  alternates: { canonical: `${SITE_URL}/careers` },
};

export default function CareersPage() {
  return (
    <div className="careers-page">
      <Header />
      <main className="careers-main">
        <section className="careers-hero" aria-labelledby="careers-title">
          <h1 id="careers-title">Careers</h1>
          <span className="careers-title-rule" aria-hidden="true" />

          <div className="careers-copy">
            <p>We&apos;re looking for amazing people to join our team.</p>
            <p>
              Please visit our{" "}
              <a href="#" target="_blank" rel="noreferrer">
                LinkedIn
              </a>{" "}
              careers page to explore our open opportunities.
            </p>
          </div>

          <div className="careers-email-block">
            <p>You may also reach out to our HR team at</p>
            <a href="mailto:careers@nestcase.in">careers@nestcase.in</a>
          </div>

          <a
            className="careers-button"
            href="#"
            target="_blank"
            rel="noreferrer"
          >
            View Open Roles
          </a>

          <div className="careers-connect">
            <div className="careers-connect-title">
              <span aria-hidden="true" />
              <p>Connect With Us</p>
              <span aria-hidden="true" />
            </div>
            <div className="careers-socials">
              <a href="#" target="_blank" rel="noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="5" y="5" width="14" height="14" rx="4" />
                  <circle cx="12" cy="12" r="3.2" />
                  <path d="M16.4 7.7h.01" />
                </svg>
              </a>
              <a href="#" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="4.8" y="4.8" width="14.4" height="14.4" rx="1.8" />
                  <path d="M8.4 10.2v6.1" />
                  <path d="M8.4 7.8h.01" />
                  <path d="M11.4 16.3v-6.1" />
                  <path d="M11.4 12.9c0-1.7 1-2.8 2.6-2.8 1.7 0 2.7 1.1 2.7 3v3.2" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
