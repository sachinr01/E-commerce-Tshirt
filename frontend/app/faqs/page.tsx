import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./faqs.css";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "NESTCASE";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

export const metadata: Metadata = {
  title: `FAQs | ${SITE_NAME}`,
  description:
    "Find answers to common questions about Nestcase orders, shipping, returns, payments, products, and support.",
  alternates: { canonical: `${SITE_URL}/faqs` },
};

const faqGroups = [
  {
    title: "Orders & Shipping",
    items: [
      {
        question: "How long does delivery take?",
        answer:
          "Most orders are delivered within 5 to 7 business days after dispatch, depending on your location.",
      },
      {
        question: "Do you offer free shipping?",
        answer:
          "Yes, free shipping is available on eligible orders and promotions shown at checkout.",
      },
      {
        question: "How can I track my order?",
        answer:
          "Once your order ships, you will receive tracking details by email or SMS.",
      },
    ],
  },
  {
    title: "Returns & Refunds",
    items: [
      {
        question: "What if I receive a damaged product?",
        answer:
          "Please contact us with your order details and product photos so our team can help with a replacement or resolution.",
      },
      {
        question: "Do you offer returns?",
        answer:
          "Returns are accepted for eligible products according to our return policy.",
      },
      {
        question: "How long do refunds take?",
        answer:
          "Approved refunds are usually processed within 5 to 7 business days to the original payment method.",
      },
    ],
  },
  {
    title: "Payments",
    items: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept major online payment methods, including cards, UPI, wallets, and net banking where available.",
      },
    ],
  },
  {
    title: "Products",
    items: [
      {
        question: "Are your products dishwasher safe?",
        answer:
          "Product care varies by item. Please check the product page or packaging for exact care instructions.",
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        question: "How can I contact nestcase?",
        answer:
          "You can reach us at support@nestcase.in and our support team will help you.",
      },
    ],
  },
];

export default function FAQsPage() {
  return (
    <div className="faqs-shell">
      <Header />
      <main className="faqs-main">
        <section className="faqs-hero" aria-labelledby="faqs-title">
          <h1 id="faqs-title">Frequently Asked Questions</h1>
          <span className="faqs-title-rule" aria-hidden="true" />
          <p>
            Find answers to the most common questions about
            <br />
            orders, shipping, returns, and more.
          </p>
        </section>

        <section className="faqs-list" aria-label="Frequently asked questions">
          {faqGroups.map((group) => (
            <div className="faqs-group" key={group.title}>
              <h2>{group.title}</h2>
              <div className="faqs-group-rule" />
              <div className="faqs-items">
                {group.items.map((item) => (
                  <details className="faqs-item" key={item.question}>
                    <summary>
                      <span className="faqs-question-icon">?</span>
                      <span className="faqs-question">{item.question}</span>
                      <span className="faqs-chevron" aria-hidden="true" />
                    </summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="faqs-contact" aria-label="Still have a question">
          <div className="faqs-mail-icon" aria-hidden="true">
            <svg viewBox="0 0 28 28">
              <path d="M4 7h20v14H4V7z" />
              <path d="M4 8l10 8 10-8" />
            </svg>
          </div>
          <div>
            <h2>Still have a question?</h2>
            <p>
              We&apos;re here to help. Reach out to us at{" "}
              <a href="mailto:support@nestcase.in">support@nestcase.in</a>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
