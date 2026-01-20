import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <div className="max-w-2xl mx-auto py-24 text-center">
      <h1 className="text-4xl font-bold mb-4 text-gray-50">Project Not Found</h1>
      <p className="text-gray-400 text-lg mb-8">
        The project you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Link
        href="/projects"
        className="inline-block px-6 py-3 bg-gray-900 border border-gray-800
                   hover:border-gray-700 rounded text-gray-300 transition-colors"
      >
        ← Back to Projects
      </Link>
    </div>
  );
}
