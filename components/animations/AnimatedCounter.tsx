"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type AnimatedCounterProps = {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
};

export function AnimatedCounter({
  value,
  duration = 1.5,
  className = "",
  prefix = "",
  suffix = "",
  decimals = 0,
}: AnimatedCounterProps) {
  const counterRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(counterRef, { once: true, margin: "-100px" });
  const prefersReducedMotion = usePrefersReducedMotion();

  // Spring animation for the count
  const springValue = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  });

  // Transform the spring value to display format
  const displayValue = useTransform(springValue, (latest) => {
    if (decimals > 0) {
      return `${prefix}${latest.toFixed(decimals)}${suffix}`;
    }
    return `${prefix}${Math.round(latest)}${suffix}`;
  });

  useEffect(() => {
    if (isInView && !prefersReducedMotion) {
      springValue.set(value);
    } else if (prefersReducedMotion) {
      springValue.jump(value);
    }
  }, [isInView, prefersReducedMotion, springValue, value]);

  // For reduced motion, just show the value
  if (prefersReducedMotion) {
    return (
      <span ref={counterRef} className={className}>
        {prefix}
        {decimals > 0 ? value.toFixed(decimals) : value}
        {suffix}
      </span>
    );
  }

  return (
    <motion.span ref={counterRef} className={className}>
      {displayValue}
    </motion.span>
  );
}
