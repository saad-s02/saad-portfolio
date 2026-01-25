"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const shapes = ["circle", "square", "triangle", "star"] as const;

export function FramerDemoVisual() {
  const [currentShape, setCurrentShape] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = () => {
    setCurrentShape((prev) => (prev + 1) % shapes.length);
  };

  const renderShape = () => {
    const shape = shapes[currentShape];
    const baseClasses = "cursor-pointer select-none";

    switch (shape) {
      case "circle":
        return (
          <motion.div
            key="circle"
            className={`w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 ${baseClasses}`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            drag
            dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
            dragElastic={0.2}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            onClick={handleClick}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        );
      case "square":
        return (
          <motion.div
            key="square"
            className={`w-32 h-32 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 ${baseClasses}`}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            drag
            dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
            dragElastic={0.2}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            onClick={handleClick}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        );
      case "triangle":
        return (
          <motion.div
            key="triangle"
            className={baseClasses}
            style={{
              width: 0,
              height: 0,
              borderLeft: "64px solid transparent",
              borderRight: "64px solid transparent",
              borderBottom: "110px solid transparent",
            }}
            initial={{ scale: 0, rotate: 180 }}
            animate={{
              scale: 1,
              rotate: 0,
              borderBottomColor: "rgb(249, 115, 22)",
            }}
            exit={{ scale: 0, rotate: -180 }}
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
            drag
            dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
            dragElastic={0.2}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            onClick={handleClick}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        );
      case "star":
        return (
          <motion.svg
            key="star"
            width="128"
            height="128"
            viewBox="0 0 128 128"
            className={baseClasses}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            drag
            dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
            dragElastic={0.2}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            onClick={handleClick}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <defs>
              <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgb(236, 72, 153)" />
                <stop offset="100%" stopColor="rgb(168, 85, 247)" />
              </linearGradient>
            </defs>
            <motion.path
              d="M64,10 L78,50 L120,50 L85,75 L98,115 L64,90 L30,115 L43,75 L8,50 L50,50 Z"
              fill="url(#starGradient)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6 }}
            />
          </motion.svg>
        );
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6">
      <motion.div
        className="relative"
        animate={{
          y: isDragging ? 0 : [0, -10, 0],
        }}
        transition={{
          y: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        {renderShape()}
      </motion.div>

      <motion.p
        className="text-sm text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Click or drag to interact
      </motion.p>
    </div>
  );
}
