"use client";

import { motion, useSpring, useMotionTemplate } from "framer-motion";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";
import { useRef, useCallback } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

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
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Spring values for magnetic effect
  const x = useSpring(0, { stiffness: 400, damping: 25 });
  const y = useSpring(0, { stiffness: 400, damping: 25 });

  // Glow effect values
  const glowOpacity = useSpring(0, { stiffness: 300, damping: 30 });
  const boxShadow = useMotionTemplate`0 0 20px rgba(59, 130, 246, ${glowOpacity})`;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!cardRef.current || prefersReducedMotion) return;

      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      const distanceX = (deltaX / (rect.width / 2)) * 4;
      const distanceY = (deltaY / (rect.height / 2)) * 4;

      x.set(distanceX);
      y.set(distanceY);
    },
    [prefersReducedMotion, x, y]
  );

  const handleMouseEnter = useCallback(() => {
    if (!prefersReducedMotion) {
      glowOpacity.set(0.15);
    }
  }, [prefersReducedMotion, glowOpacity]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    glowOpacity.set(0);
  }, [x, y, glowOpacity]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Link href={`/projects/${project.slug}`}>
        <motion.div
          ref={cardRef}
          style={{
            x,
            y,
            boxShadow,
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
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
