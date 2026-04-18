// src/app/blog/[slug]/page.tsx

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createMetadata } from '@/lib/metadata';
import { siteConfig } from '@/content/site';
import {
  getBlogPost,
  getAllBlogSlugs,
  getRelatedPosts,
  getPostNavigation,
} from '@/lib/blog';
import { Container, Section, ScrollFade, BackLink } from '@/components/common';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ReadingProgress,
  TableOfContents,
  BlogContent,
  ShareLinks,
  PostNavigation,
  RelatedPosts,
} from '@/components/features/blog';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};

  return createMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${slug}`,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) notFound();

  const related = getRelatedPosts(slug, post.tags, 3);
  const { prev, next } = getPostNavigation(slug);
  const postUrl = `${siteConfig.url}/blog/${slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    author: {
      '@type': 'Person',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    wordCount: post.wordCount,
  };

  return (
    <>
      <ReadingProgress />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section>
        <Container>
          {/* ── Header ── */}
          <ScrollFade>
            <BackLink href="/blog" label="Back to blog" />

            <div className="mt-8">
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-3 font-mono text-sm text-muted-foreground">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </time>
                <span className="text-border">·</span>
                <span>{post.readingTime}</span>
                <span className="text-border">·</span>
                <span>{post.wordCount} words</span>
              </div>

              {/* Title */}
              <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.5rem] lg:leading-tight">
                {post.title}
              </h1>

              {/* Description */}
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {post.description}
              </p>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link key={tag} href={`/blog/tag/${tag}`}>
                    <Badge
                      variant="secondary"
                      className="cursor-pointer font-mono text-xs font-normal transition-colors hover:bg-muted-foreground/10"
                    >
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </ScrollFade>

          {/* ── TOC ── */}
          {post.toc.length >= 3 && (
            <ScrollFade delay={60}>
              <div className="mt-10">
                <TableOfContents items={post.toc} />
              </div>
            </ScrollFade>
          )}

          {/* ── Content ── */}
          <ScrollFade delay={100}>
            <Separator className="my-10" />
            <BlogContent html={post.content} />
          </ScrollFade>

          {/* ── Footer ── */}
          <ScrollFade delay={120}>
            <Separator className="my-14" />

            {/* Share */}
            <ShareLinks url={postUrl} title={post.title} />

            {/* Updated Date */}
            {post.updated && (
              <p className="mt-6 font-mono text-xs text-muted-foreground/60">
                Last updated:{' '}
                {new Date(post.updated).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            )}
          </ScrollFade>

          {/* ── Related ── */}
          {related.length > 0 && (
            <ScrollFade delay={140}>
              <Separator className="my-14" />
              <RelatedPosts posts={related} />
            </ScrollFade>
          )}

          {/* ── Navigation ── */}
          <ScrollFade delay={160}>
            <Separator className="my-14" />
            <PostNavigation prev={prev} next={next} />
          </ScrollFade>
        </Container>
      </Section>
    </>
  );
}