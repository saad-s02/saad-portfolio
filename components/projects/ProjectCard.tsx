"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";

type Project = {
  _id: Id<"projects">;
  title: string;
  slug: string;
  summary: string;
  stack: string[];
  tags: string[];
};

type Props = {
  project: Project;
};

export function ProjectCard({ project }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Link href={`/projects/${project.slug}`}>
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gray-900 rounded-lg p-6 border border-gray-800
                     hover:border-gray-700 transition-colors h-full flex flex-col"
        >
          <h3 className="text-xl font-bold mb-2 text-gray-50">{project.title}</h3>
          <p className="text-gray-400 mb-4 line-clamp-3 flex-grow">{project.summary}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.stack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 bg-gray-800 rounded text-sm text-gray-300"
              >
                {tech}
              </span>
            ))}
            {project.stack.length > 4 && (
              <span className="px-2 py-1 bg-gray-800 rounded text-sm text-gray-500">
                +{project.stack.length - 4}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="text-xs text-gray-600">
                #{tag}
              </span>
            ))}
          </div>
        </motion.div>
      </Link>
    </motion.article>
  );
}
