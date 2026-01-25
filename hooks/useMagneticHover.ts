"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useSpring, SpringOptions } from "framer-motion";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type MagneticHoverOptions = {
  maxDistance?: number;
  springConfig?: SpringOptions;
  disabled?: boolean;
};

export function useMagneticHover({
  maxDistance = 6,
  springConfig = { stiffness: 400, damping: 25 },
  disabled = false,
}: MagneticHoverOptions = {}) {
  const elementRef = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!elementRef.current || disabled || prefersReducedMotion) return;

      const rect = elementRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Calculate distance from center as a ratio
      const distanceX = (deltaX / (rect.width / 2)) * maxDistance;
      const distanceY = (deltaY / (rect.height / 2)) * maxDistance;

      x.set(distanceX);
      y.set(distanceY);
    },
    [disabled, prefersReducedMotion, maxDistance, x, y]
  );

  const handleMouseEnter = useCallback(() => {
    if (!disabled && !prefersReducedMotion) {
      setIsHovered(true);
    }
  }, [disabled, prefersReducedMotion]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  }, [x, y]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave]);

  return {
    elementRef,
    style: {
      x,
      y,
    },
    isHovered,
  };
}
