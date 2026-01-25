"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ClaudeWorkflowVisual } from "./highlights/ClaudeWorkflowVisual";
import { TechStackVisual } from "./highlights/TechStackVisual";
import { WorkflowDiagramVisual } from "./highlights/WorkflowDiagramVisual";
import { FramerDemoVisual } from "./highlights/FramerDemoVisual";
import { AdminPanelVisual } from "./highlights/AdminPanelVisual";

const highlights = [
  {
    id: "claude-workflow",
    number: "01",
    title: "Claude Code workflow integration",
    summary: "Automated development pipeline from issue to deployment",
    details:
      "Complete CI/CD automation using Claude Code: issue tracking, automated PR reviews, continuous integration, and instant deployment with changelog generation.",
    visual: ClaudeWorkflowVisual,
  },
  {
    id: "tech-stack",
    number: "02",
    title: "Next.js, TypeScript, Convex, WorkOS",
    summary: "Modern full-stack architecture",
    details:
      "Built with Next.js 14 App Router, TypeScript for type safety, Convex for real-time backend, and WorkOS AuthKit for secure authentication.",
    visual: TechStackVisual,
  },
  {
    id: "ai-workflows",
    number: "03",
    title: "AI-powered workflows",
    summary: "Intelligent automation at every step",
    details:
      "Leveraging AI for code reviews, spec generation, implementation planning, and automated testing. Reduces manual work while maintaining high code quality.",
    visual: WorkflowDiagramVisual,
  },
  {
    id: "animations",
    number: "04",
    title: "Framer Motion animations",
    summary: "Polished, interactive user experience",
    details:
      "Smooth page transitions, scroll-driven reveals, spring physics, and gesture-based interactions. All animations respect prefers-reduced-motion.",
    visual: FramerDemoVisual,
  },
  {
    id: "admin-panel",
    number: "05",
    title: "Real-time admin panel",
    summary: "Draft-to-publish workflow management",
    details:
      "Secure admin interface for content management with real-time synchronization, draft/publish states, and instant preview. Protected by WorkOS authentication.",
    visual: AdminPanelVisual,
  },
];

export function HighlightsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const handleHighlightClick = (index: number) => {
    setActiveIndex(index);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="py-8 lg:py-12">
      <motion.h2
        className="text-3xl md:text-4xl font-bold mb-6 lg:mb-8 text-gray-50"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Highlights
      </motion.h2>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
        {/* Left column: Clickable cards */}
        <div className="space-y-2">
          {highlights.map((highlight, index) => {
            const isActive = activeIndex === index;
            const isExpanded = expandedIndex === index;

            return (
              <motion.div
                key={highlight.id}
                className={`border rounded-lg transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "border-gray-600 bg-gray-900/50"
                    : "border-gray-800 bg-gray-900/20 hover:border-gray-700"
                }`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleHighlightClick(index)}
              >
                <div className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    <span
                      className={`text-xs font-mono font-bold mt-0.5 transition-colors ${
                        isActive ? "text-blue-400" : "text-gray-600"
                      }`}
                    >
                      {highlight.number}
                    </span>

                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-sm font-semibold transition-colors ${
                          isActive ? "text-gray-50" : "text-gray-300"
                        }`}
                      >
                        {highlight.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">{highlight.summary}</p>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                              {highlight.details}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <motion.svg
                      className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </motion.svg>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right column: Synchronized visuals */}
        <div className="hidden lg:block sticky top-24 h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full flex items-center justify-center bg-gray-900/30 rounded-lg border border-gray-800 p-6"
            >
              {(() => {
                const VisualComponent = highlights[activeIndex]?.visual;
                return VisualComponent ? <VisualComponent /> : null;
              })()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile: Visuals appear below each expanded highlight */}
        <div className="lg:hidden space-y-2">
          {highlights.map((highlight, index) => {
            const VisualComponent = highlight.visual;
            return (
              <AnimatePresence key={`mobile-${highlight.id}`}>
                {expandedIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 250 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden bg-gray-900/30 rounded-lg border border-gray-800 p-4"
                  >
                    <VisualComponent />
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })}
        </div>
      </div>
    </section>
  );
}
