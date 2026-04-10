'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { staticBlogs } from './staticblog';

const STORAGE_KEY = 'blogVisibleCount';
const SCROLL_KEY = 'blogScrollY';

type Blog = {
  slug: string;
  image: string;
  date: string;
  title: string;
  summary: string;
  content: string;
};

const INITIAL_COUNT = 3; // change to 9/10 for production
const LOAD_MORE_COUNT = 3; // change to 9/10 for production

const fetchBlogs = async (): Promise<Blog[]> => {
  try {
    const res = await fetch('/store/api/blogs', { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    if (data?.success && Array.isArray(data.data)) return data.data;
    return [];
  } catch {
    return [];
  }
};

const combineBlogs = (dynamicBlogs: Blog[], fallbackBlogs: Blog[]) => {
  const combined = [...dynamicBlogs, ...fallbackBlogs];
  return combined.filter((item, index, arr) => (
    arr.findIndex((b) => b.slug === item.slug) === index
  ));
};

export default function BlogIndexPage() {
  const [dynamicBlogs, setDynamicBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const hasRestoredRef = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = Number(sessionStorage.getItem(STORAGE_KEY));
      if (!Number.isNaN(saved) && saved > 0) {
        setVisibleCount(saved);
      }
    }
    let mounted = true;
    fetchBlogs()
      .then((data) => {
        if (!mounted) return;
        setDynamicBlogs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setDynamicBlogs([]);
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (loading) return;
    if (hasRestoredRef.current) return;
    if (typeof window !== 'undefined') {
      const saved = Number(sessionStorage.getItem(SCROLL_KEY));
      if (!Number.isNaN(saved) && saved > 0) {
        requestAnimationFrame(() => window.scrollTo(0, saved));
      }
      sessionStorage.removeItem(SCROLL_KEY);
    }
    hasRestoredRef.current = true;
  }, [loading, visibleCount]);

  const combined = useMemo(
    () => combineBlogs(dynamicBlogs, staticBlogs),
    [dynamicBlogs]
  );

  const posts = combined.slice(0, visibleCount);
  const canLoadMore = visibleCount < combined.length;

  const categories = [
    { name: 'Template', count: 15 },
    { name: 'Wordpress', count: 2 },
    { name: 'Brand', count: 6 },
    { name: 'Creative', count: 11 },
    { name: 'Corporate', count: 8 },
    { name: 'Template', count: 15 },
  ];

  const featured = combined.slice(0, 3);

  const handleLoadMore = () => {
    setVisibleCount((count) => {
      const next = Math.min(count + LOAD_MORE_COUNT, combined.length);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(STORAGE_KEY, String(next));
      }
      return next;
    });
  };

  const handleCardClick = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY, String(visibleCount));
      sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
    }
  };

  return (
    <>
      <style>{`
        .blog-list-page { background: #f7f5f2; min-height: 80vh; }
        .blog-list-hero {
          max-width: 1160px;
          margin: 0 auto;
          padding: 40px 24px 10px;
        }
        .blog-list-title {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 6px;
          letter-spacing: -0.4px;
          color: #1a1a1a;
        }
        .blog-list-subtitle {
          font-size: 13px;
          color: #8c857d;
          margin: 0 0 22px;
        }
        .blog-list-layout {
          max-width: 1160px;
          margin: 0 auto;
          padding: 0 24px 72px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 300px;
          gap: 32px;
          align-items: start;
        }
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
        }
        .blog-card {
          background: #fff;
          border: 1px solid #ece7df;
          border-radius: 4px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          display: block;
          transition: box-shadow 0.22s ease, transform 0.22s ease;
        }
        .blog-card:hover {
          box-shadow: 0 8px 28px rgba(0,0,0,0.08);
          transform: translateY(-3px);
        }
        .blog-card-img {
          width: 100%;
          aspect-ratio: 1 / 1;
          background: #f0ebe3;
          overflow: hidden;
        }
        .blog-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }
        .blog-card:hover .blog-card-img img { transform: scale(1.04); }
        .blog-card-body { padding: 16px 18px 18px; }
        .blog-card-date {
          display: block;
          font-size: 11px;
          color: #9a948c;
          letter-spacing: 0.4px;
          margin-bottom: 8px;
        }
        .blog-card-title {
          font-size: 14px;
          font-weight: 700;
          color: #2a2621;
          margin: 0 0 10px;
          line-height: 1.5;
        }
        .blog-card-summary {
          font-size: 12px;
          color: #777069;
          line-height: 1.6;
          margin: 0 0 14px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .blog-card-link {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          color: #1a1a1a;
          border-bottom: 1.5px solid #1a1a1a;
          padding-bottom: 2px;
        }
        .blog-empty {
          padding: 20px 0 24px;
          color: #777;
          font-size: 14px;
        }
        .load-more-wrap {
          display: flex;
          justify-content: center;
          margin-top: 28px;
        }
        .load-more-btn {
          background: #1a1a1a;
          color: #fff;
          border: none;
          padding: 10px 18px;
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
        }
        .load-more-btn:disabled {
          opacity: 0.5;
          cursor: default;
        }

        .blog-sidebar {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }
        .widget {
          border: 1px solid #e4dbd1;
          background: #fff;
          padding: 22px 24px;
          font-family: "Lato", "Open Sans", sans-serif;
        }
        .widget-title {
          margin: 0 0 16px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          color: #6a625a;
        }
        .widget-content { font-size: 14px; color: #6f6760; }
        .with-border {
          list-style: none;
          margin: 0;
          padding: 0;
          border-top: 1px solid #efe7dd;
        }
        .with-border li {
          border-bottom: 1px solid #efe7dd;
          padding: 14px 0;
        }
        .with-border li:last-child { border-bottom: none; }
        .categories-posts a,
        .featured-posts a {
          text-decoration: none;
          color: inherit;
        }
        .categories-posts a {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          color: #6b645c;
        }
        .categories-posts a:hover { color: #1a1a1a; }
        .categories-posts .cat-count {
          color: #9f978f;
          font-variant-numeric: tabular-nums;
          letter-spacing: 0.3px;
        }
        .featured-posts h6 {
          margin: 0 0 6px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.1px;
          text-transform: uppercase;
          color: #3f3a33;
        }
        .featured-posts span {
          display: block;
          font-size: 12px;
          color: #9a948c;
        }
        .featured-posts a:hover h6 { color: #e4572e; }

        @media (max-width: 1100px) {
          .blog-list-layout { grid-template-columns: minmax(0, 1fr) 280px; }
          .blog-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 900px) {
          .blog-list-layout { grid-template-columns: 1fr; }
        }
        @media (max-width: 560px) {
          .blog-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <Header />
      <div className="dima-main blog-list-page">
        <div className="blog-list-hero">
          <h1 className="blog-list-title">From The Blog</h1>
          <p className="blog-list-subtitle">Latest updates, stories, and inspirations.</p>
        </div>

        <div className="blog-list-layout">
          <div>
            {!loading && posts.length === 0 ? (
              <div className="blog-empty">No blogs available right now.</div>
            ) : (
              <>
                <div className="blog-grid">
                  {posts.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card" onClick={handleCardClick}>
                      <div className="blog-card-img">
                        <img src={post.image} alt={post.title} />
                      </div>
                      <div className="blog-card-body">
                        <span className="blog-card-date">{post.date}</span>
                        <h3 className="blog-card-title">{post.title}</h3>
                        <p className="blog-card-summary">{post.summary}</p>
                        <span className="blog-card-link">Read More</span>
                      </div>
                    </Link>
                  ))}
                </div>
                {canLoadMore && (
                  <div className="load-more-wrap">
                    <button className="load-more-btn" onClick={handleLoadMore}>
                      Load More
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <aside className="blog-sidebar">
            <div className="widget">
              <h5 className="widget-title">Categories</h5>
              <div className="widget-content">
                <ul className="with-border categories-posts">
                  {categories.map((cat) => (
                    <li key={cat.name}>
                      <Link href="/blog">
                        <span className="cat-name">{cat.name}</span>
                        <span className="cat-count">{String(cat.count).padStart(2, '0')}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="widget">
              <h5 className="widget-title">Featured Posts</h5>
              <div className="widget-content">
                <ul className="with-border featured-posts">
                  {featured.length > 0 ? (
                    featured.map((r) => (
                      <li key={r.slug}>
                        <Link href={`/blog/${r.slug}`}>
                          <h6>{r.title}</h6>
                        </Link>
                        <span>By Admin / {r.date}</span>
                      </li>
                    ))
                  ) : (
                    <li style={{ fontSize: 12, color: '#9a948c' }}>No featured blogs yet.</li>
                  )}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </>
  );
}


