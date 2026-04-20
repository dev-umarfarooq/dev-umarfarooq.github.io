import {
  Hero,
  AboutPreview,
  FeaturedProject,
  ProjectsPreview,
  Approach,
  BlogPreview,
  ContactCta,
} from '@/components/sections';

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutPreview />
      <FeaturedProject />
      <ProjectsPreview />
      <Approach />
      <BlogPreview />
      <ContactCta />
    </>
  );
}