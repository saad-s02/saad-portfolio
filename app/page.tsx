import { Suspense } from "react";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { HeroSection } from "@/components/home/HeroSection";
import { HighlightsSection } from "@/components/home/HighlightsSection";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { AutomationTeaser } from "@/components/home/AutomationTeaser";
import { ContactCTA } from "@/components/home/ContactCTA";

export const metadata = {
  title: null, // Use default title from layout ('Portfolio')
  description: "Full-stack engineer building automated workflows with Next.js, TypeScript, and AI-assisted development. See projects and engineering automation in action.",
  openGraph: {
    title: 'Portfolio',
    description: "Full-stack engineer building automated workflows with Next.js, TypeScript, and AI-assisted development.",
    type: 'website',
    url: 'https://yourdomain.com',
  },
  alternates: {
    canonical: 'https://yourdomain.com',
  },
};

export default async function HomePage() {
  // Preload featured projects for client-side reactivity
  const preloadedFeatured = await preloadQuery(api.projects.listFeatured);

  return (
    <div className="space-y-24 pb-24">
      <HeroSection />
      <HighlightsSection />

      <Suspense fallback={<div className="h-96 animate-pulse bg-gray-900 rounded-lg" />}>
        <FeaturedProjects preloadedProjects={preloadedFeatured} />
      </Suspense>

      <AutomationTeaser />
      <ContactCTA />
    </div>
  );
}
