// src/app/blog/tag/[tag]/page.tsx

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createMetadata } from '@/lib/metadata';
import { getAllTags, getPostsByTag } from '@/lib/blog';
import { Container, Section, ScrollFade, BackLink } from '@/components/common';
import { BlogCard, TagList } from '@/components/features/blog';
import { Separator } from '@/components/ui/separator';

interface PageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params;
  return createMetadata({
    title: `Posts tagged "${tag}"`,
    description: `Articles about ${tag} — architecture, engineering, and lessons from building production systems.`,
    path: `/blog/tag/${tag}`,
  });
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  const allTags = getAllTags();

  if (!allTags.includes(tag)) notFound();

  const posts = getPostsByTag(tag);

  return (
    <Section>
      <Container>
        <ScrollFade>
          <BackLink href="/blog" label="Back to blog" />

          <div className="mt-8">
            <p className="font-mono text-sm tracking-widest text-muted-foreground/60 uppercase">
              Tagged
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              {tag}
            </h1>
            <p className="mt-3 text-muted-foreground">
              {posts.length} {posts.length === 1 ? 'article' : 'articles'}
            </p>
          </div>
        </ScrollFade>

        <ScrollFade delay={60}>
          <div className="mt-8">
            <TagList tags={allTags} activeTag={tag} />
          </div>
        </ScrollFade>

        <ScrollFade delay={100}>
          <Separator className="mt-10" />
          <div className="divide-y divide-border">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </ScrollFade>
      </Container>
    </Section>
  );
}