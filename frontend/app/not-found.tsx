import Link from 'next/link';
import Header from './components/Header';
import Footer from './components/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="nf-page">
        <div className="nf-inner">
          <p className="nf-code">404</p>
          <div className="nf-divider" />
          <h1 className="nf-title">Page Not Found</h1>
          <p className="nf-desc">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.<br />
            Let&apos;s get you back on track.
          </p>
          <div className="nf-actions">
            <Link href="/" className="nf-btn-primary">Go to Home</Link>
            <Link href="/shop" className="nf-btn-secondary">Browse Shop</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
