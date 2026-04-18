// lib/blog.ts

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import type { BlogPost, BlogPostMeta, TocItem } from '@/types';

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

// ── Helpers ──

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function calculateReadingTime(text: string): { text: string; words: number } {
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(words / 200);
  return { text: `${minutes} min read`, words };
}

function extractToc(markdown: string): TocItem[] {
  const lines = markdown.split('\n');
  const headings: TocItem[] = [];
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      headings.push({ id: slugify(text), text, level });
    }
  }

  return headings;
}

function getMarkdownFiles(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith('.md'))
    .sort();
}

function parsePostMeta(filename: string): BlogPostMeta | null {
  const filepath = path.join(BLOG_DIR, filename);
  const raw = fs.readFileSync(filepath, 'utf-8');
  const { data, content } = matter(raw);

  if (!data.published) return null;

  const { text, words } = calculateReadingTime(content);

  return {
    slug: filename.replace(/\.md$/, ''),
    title: data.title || '',
    description: data.description || '',
    date: data.date || '',
    updated: data.updated || undefined,
    tags: data.tags || [],
    readingTime: text,
    wordCount: words,
    published: data.published ?? false,
  };
}

// ── Public API ──

export function getBlogPosts(): BlogPostMeta[] {
  return getMarkdownFiles()
    .map(parsePostMeta)
    .filter((post): post is BlogPostMeta => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getRecentBlogPosts(count = 3): BlogPostMeta[] {
  return getBlogPosts().slice(0, count);
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const filename = `${slug}.md`;
  const filepath = path.join(BLOG_DIR, filename);

  if (!fs.existsSync(filepath)) return null;

  const raw = fs.readFileSync(filepath, 'utf-8');
  const { data, content } = matter(raw);

  if (!data.published) return null;

  const { text, words } = calculateReadingTime(content);
  const toc = extractToc(content);

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'prepend',
      properties: {
        className: ['heading-anchor'],
        ariaHidden: 'true',
        tabIndex: -1,
      },
      content: [
        {
          type: 'element',
          tagName: 'span',
          properties: { className: ['heading-anchor-icon'] },
          children: [{ type: 'text', value: '#' }],
        },
      ],
    })
    .use(rehypeHighlight, { detect: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  return {
    slug,
    title: data.title || '',
    description: data.description || '',
    date: data.date || '',
    updated: data.updated || undefined,
    tags: data.tags || [],
    readingTime: text,
    wordCount: words,
    published: true,
    content: String(result),
    toc,
  };
}

export function getAllBlogSlugs(): string[] {
  return getBlogPosts().map((p) => p.slug);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  getBlogPosts().forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}

export function getPostsByTag(tag: string): BlogPostMeta[] {
  return getBlogPosts().filter((post) => post.tags.includes(tag));
}

export function getRelatedPosts(
  currentSlug: string,
  tags: string[],
  count = 3
): BlogPostMeta[] {
  return getBlogPosts()
    .filter((p) => p.slug !== currentSlug)
    .map((p) => ({
      ...p,
      relevance: p.tags.filter((t) => tags.includes(t)).length,
    }))
    .filter((p) => p.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, count);
}

export function getPostNavigation(currentSlug: string) {
  const posts = getBlogPosts();
  const index = posts.findIndex((p) => p.slug === currentSlug);
  if (index === -1) return { prev: undefined, next: undefined };

  return {
    prev: index < posts.length - 1 ? posts[index + 1] : undefined,
    next: index > 0 ? posts[index - 1] : undefined,
  };
}