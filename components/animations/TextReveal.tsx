"use client";

import { motion, Variants } from "framer-motion";

type TextRevealProps = {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  staggerDelay?: number;
  duration?: number;
};

const containerVariants: Variants = {
  hidden: {},
  visible: (custom: { staggerDelay: number; delay: number }) => ({
    transition: {
      staggerChildren: custom.staggerDelay,
      delayChildren: custom.delay,
    },
  }),
};

const wordVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 15,
  },
  visible: (custom: { duration: number }) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: custom.duration,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

export function TextReveal({
  children,
  className = "",
  as = "span",
  delay = 0,
  staggerDelay = 0.08,
  duration = 0.4,
}: TextRevealProps) {
  const words = children.split(" ");

  const containerProps = {
    className,
    variants: containerVariants,
    initial: "hidden" as const,
    animate: "visible" as const,
    custom: { staggerDelay, delay },
    "aria-label": children,
  };

  const wordElements = words.map((word, index) => (
    <motion.span
      key={`${word}-${index}`}
      className="inline-block"
      variants={wordVariants}
      custom={{ duration }}
      style={{ marginRight: "0.25em" }}
    >
      {word}
    </motion.span>
  ));

  // Use explicit JSX for each element type to avoid motion.create during render
  switch (as) {
    case "h1":
      return <motion.h1 {...containerProps}>{wordElements}</motion.h1>;
    case "h2":
      return <motion.h2 {...containerProps}>{wordElements}</motion.h2>;
    case "h3":
      return <motion.h3 {...containerProps}>{wordElements}</motion.h3>;
    case "p":
      return <motion.p {...containerProps}>{wordElements}</motion.p>;
    default:
      return <motion.span {...containerProps}>{wordElements}</motion.span>;
  }
}
