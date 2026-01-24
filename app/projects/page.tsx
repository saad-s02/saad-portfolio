import { Suspense } from "react";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { ProjectGrid } from "@/components/projects/ProjectGrid";

export const metadata = {
  title: "Projects",
  description: "Portfolio of web applications, automation workflows, and engineering projects built with Next.js, TypeScript, and modern web technologies.",
  openGraph: {
    title: "Projects",
    description: "Portfolio of web applications, automation workflows, and engineering projects.",
    type: 'website',
    url: 'https://saadsiddiqui.dev/projects',
  },
  alternates: {
    canonical: 'https://saadsiddiqui.dev/projects',
  },
};

export default async function ProjectsPage() {
  const preloadedProjects = await preloadQuery(api.projects.listPublished);

  return (
    <div className="space-y-12 pb-16">
      <section>
        <h1 className="text-4xl font-bold mb-4 text-gray-50">Projects</h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          A selection of web applications, automation workflows, and engineering projects
          demonstrating full-stack development, AI-assisted workflows, and modern web technologies.
        </p>
      </section>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 bg-gray-900 rounded-lg animate-pulse border border-gray-800"
              />
            ))}
          </div>
        }
      >
        <ProjectGrid preloadedProjects={preloadedProjects} />
      </Suspense>
    </div>
  );
}
