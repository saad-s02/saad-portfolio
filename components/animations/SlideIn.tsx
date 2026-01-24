"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

type Direction = "left" | "right" | "up" | "down";

type SlideInProps = {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
};

/**
 * SlideIn - Directional scroll reveal wrapper with accessibility support
 *
 * Wraps content with Framer Motion scroll reveal animation that slides in
 * content from a specified direction when it enters the viewport.
 * Automatically respects prefers-reduced-motion for accessibility compliance.
 *
 * @param children - Content to animate
 * @param direction - Animation direction: "left" | "right" | "up" | "down" (default: "up")
 * @param delay - Animation delay in seconds (default: 0)
 *
 * @example
 * ```tsx
 * <SlideIn direction="left" delay={0.1}>
 *   <div>This will slide in from the left</div>
 * </SlideIn>
 * ```
 */
export function SlideIn({ children, direction = "up", delay = 0 }: SlideInProps) {
  const shouldReduceMotion = useReducedMotion();

  // Calculate initial position based on direction
  // Use moderate values (20-30px) to avoid janky animation on mobile
  const getInitialPosition = (): { opacity: number; x?: number; y?: number } => {
    if (shouldReduceMotion) {
      return { opacity: 1 };
    }

    switch (direction) {
      case "left":
        return { opacity: 0, x: -30 };
      case "right":
        return { opacity: 0, x: 30 };
      case "up":
        return { opacity: 0, y: 20 };
      case "down":
        return { opacity: 0, y: -20 };
      default:
        return { opacity: 0, y: 20 };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
