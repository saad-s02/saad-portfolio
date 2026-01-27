import type { Metadata } from "next";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string }>;
};

// Enable ISR - revalidate every hour (3600 seconds)
export const revalidate = 3600;

// Generate static params for build-time rendering
export async function generateStaticParams() {
  const projects = await fetchQuery(api.projects.listPublished);
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

// Generate SEO metadata per project
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await fetchQuery(api.projects.getBySlug, { slug });

  if (!project) {
    return {
      title: "Project Not Found",
      robots: {
        index: false,
      },
    };
  }

  return {
    title: `${project.title} | Projects`,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "article",
      url: `https://saadsiddiqui.dev/projects/${slug}`,
    },
    alternates: {
      canonical: `https://saadsiddiqui.dev/projects/${slug}`,
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await fetchQuery(api.projects.getBySlug, { slug });

  // Handle 404 for invalid slugs
  if (!project) {
    notFound();
  }

  // Parse content sections (assuming content has problem/approach/impact/constraints structure)
  const sections = parseProjectContent(project.content);

  return (
    <article className="max-w-4xl mx-auto space-y-12 pb-16">
      {/* Header */}
      <header>
        <Link
          href="/projects"
          className="text-gray-500 hover:text-gray-400 transition-colors mb-4 inline-block"
        >
          ← Back to Projects
        </Link>
        <h1 className="text-4xl font-bold mb-4 text-gray-50">{project.title}</h1>
        <p className="text-xl text-gray-400">{project.summary}</p>
      </header>

      {/* Stack */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-gray-50">Tech Stack</h2>
        <div className="flex flex-wrap gap-3">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="px-4 py-2 bg-gray-900 border border-gray-800 rounded text-gray-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Content Sections */}
      {sections.problem && (
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-50">Problem</h2>
          <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
            {sections.problem}
          </div>
        </section>
      )}

      {sections.approach && (
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-50">Approach</h2>
          <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
            {sections.approach}
          </div>
        </section>
      )}

      {sections.constraints && (
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-50">Constraints</h2>
          <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
            {sections.constraints}
          </div>
        </section>
      )}

      {sections.impact && (
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-50">Impact</h2>
          <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
            {sections.impact}
          </div>
        </section>
      )}

      {/* Fallback if content doesn't have structured sections */}
      {!sections.problem && !sections.approach && project.content && (
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-50">Details</h2>
          <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap">
            {project.content}
          </div>
        </section>
      )}

      {/* Links */}
      {project.links.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-50">Links</h2>
          <div className="flex flex-wrap gap-4">
            {project.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gray-900 border border-gray-800
                           hover:border-gray-700 rounded text-gray-300
                           hover:text-gray-50 transition-colors"
              >
                {link.label} →
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Tags */}
      {project.tags.length > 0 && (
        <section>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="text-sm text-gray-600">
                #{tag}
              </span>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

// Helper function to parse content into sections
// Assumes content is plain text with section markers like "## Problem", "## Approach", etc.
function parseProjectContent(content: string) {
  const sections: Record<string, string> = {};

  const problemMatch = content.match(/##\s*Problem\s*\n([\s\S]*?)(?=##|$)/i);
  const approachMatch = content.match(/##\s*Approach\s*\n([\s\S]*?)(?=##|$)/i);
  const constraintsMatch = content.match(/##\s*Constraints\s*\n([\s\S]*?)(?=##|$)/i);
  const impactMatch = content.match(/##\s*Impact\s*\n([\s\S]*?)(?=##|$)/i);

  if (problemMatch) sections.problem = problemMatch[1].trim();
  if (approachMatch) sections.approach = approachMatch[1].trim();
  if (constraintsMatch) sections.constraints = constraintsMatch[1].trim();
  if (impactMatch) sections.impact = impactMatch[1].trim();

  return sections;
}
