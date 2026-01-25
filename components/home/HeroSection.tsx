"use client";

import { TextReveal } from "@/components/animations/TextReveal";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Track scroll progress of the hero section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Fade out gradients as user scrolls past the hero
  const gradientOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.6, 0]);

  return (
    <section ref={sectionRef} className="min-h-[60vh] flex flex-col justify-center relative">
      {/* Full-width animated background gradient with scroll-based fade */}
      <motion.div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{ opacity: gradientOpacity }}
      >
        <div className="hero-gradient-1" />
        <div className="hero-gradient-2" />
      </motion.div>

      <div className="relative z-10">
        <TextReveal
          as="h1"
          className="text-5xl md:text-7xl font-bold mb-6 text-gray-50"
          delay={0}
          staggerDelay={0.08}
        >
          Saad Siddiqui
        </TextReveal>

        <TextReveal
          as="p"
          className="text-2xl md:text-3xl text-gray-400 mb-4"
          delay={0.3}
          staggerDelay={0.06}
        >
          Full-Stack Software Engineer
        </TextReveal>

        <motion.p
          className="text-xl text-gray-500 max-w-2xl"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.6,
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          Building AI-powered applications and scalable production systems.
          Specializing in full-stack development, LLMs, and enterprise tooling.
        </motion.p>
      </div>
    </section>
  );
}
