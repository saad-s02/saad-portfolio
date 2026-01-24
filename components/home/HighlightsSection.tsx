"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";

export function HighlightsSection() {
  const shouldReduceMotion = useReducedMotion();

  const highlights = [
    "End-to-end automated portfolio with Claude Code workflow integration",
    "Full-stack development with Next.js, TypeScript, Convex, and WorkOS",
    "AI-powered development workflows for faster iteration and deployment",
    "Dark minimalist design with Framer Motion animations",
    "Real-time admin panel with draft/publish workflow",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  if (shouldReduceMotion) {
    return (
      <section>
        <h2 className="text-3xl font-bold mb-8 text-gray-50">Highlights</h2>
        <ul className="space-y-4">
          {highlights.map((highlight, i) => (
            <li key={i} className="flex items-start">
              <span className="text-gray-500 mr-3">→</span>
              <span className="text-gray-300 text-lg">{highlight}</span>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-3xl font-bold mb-8 text-gray-50">Highlights</h2>
      <motion.ul
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {highlights.map((highlight, i) => (
          <motion.li key={i} className="flex items-start" variants={itemVariants}>
            <span className="text-gray-500 mr-3">→</span>
            <span className="text-gray-300 text-lg">{highlight}</span>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
