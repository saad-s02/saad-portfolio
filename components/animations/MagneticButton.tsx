"use client";

import { motion, useSpring, SpringOptions, HTMLMotionProps } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { ReactNode, forwardRef, useCallback } from "react";

type MagneticButtonProps = Omit<
  HTMLMotionProps<"button">,
  "children" | "style"
> & {
  children: ReactNode;
  maxDistance?: number;
  springConfig?: SpringOptions;
};

export const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  function MagneticButton(
    {
      children,
      className = "",
      maxDistance = 4,
      springConfig = { stiffness: 400, damping: 25 },
      ...props
    },
    forwardedRef
  ) {
    const prefersReducedMotion = usePrefersReducedMotion();
    const x = useSpring(0, springConfig);
    const y = useSpring(0, springConfig);

    const handleMouseMove = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (prefersReducedMotion) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        const distanceX = (deltaX / (rect.width / 2)) * maxDistance;
        const distanceY = (deltaY / (rect.height / 2)) * maxDistance;

        x.set(distanceX);
        y.set(distanceY);
      },
      [prefersReducedMotion, maxDistance, x, y]
    );

    const handleMouseLeave = useCallback(() => {
      x.set(0);
      y.set(0);
    }, [x, y]);

    return (
      <motion.button
        ref={forwardedRef}
        style={{ x, y }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={className}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
