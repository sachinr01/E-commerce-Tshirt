'use client';
/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import type { BlogCard } from '../types';

export type BlogPostCardData = BlogCard;

export default function BlogPostCard({
  post,
  href,
  onClick,
}: {
  post: BlogPostCardData;
  href: string;
  onClick?: () => void;
  }) {
  return (
    <Link href={href} className="blog-post-card" onClick={onClick}>
      <div className="blog-post-card__image-wrap">
        {post.image ? (
          <img
            className="blog-post-card__image"
            src={post.image}
            alt={post.title}
            loading="lazy"
            decoding="async"
          />
        ) : null}
      </div>
      <div className="blog-post-card__body">
        <span className="blog-post-card__date">{post.date}</span>
        <h3 className="blog-post-card__title">{post.title}</h3>
        <p className="blog-post-card__summary">{post.summary}</p>
      </div>
    </Link>
  );
}
