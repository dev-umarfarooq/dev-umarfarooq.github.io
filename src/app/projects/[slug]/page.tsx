// src/app/projects/[slug]/page.tsx

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createMetadata } from '@/lib/metadata';
import { getProjectBySlug, getAllProjectSlugs } from '@/content/projects';
import { ProjectLayout, CaseStudyLayout } from '@/components/features/projects';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return createMetadata({
    title: project.title,
    description: project.subtitle,
    path: `/projects/${slug}`,
  });
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  if (project.type === 'featured') {
    return <CaseStudyLayout project={project} />;
  }

  return <ProjectLayout project={project} />;
}