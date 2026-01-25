"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const nodes = [
  { id: 1, label: "Issue", x: 10, y: 50 },
  { id: 2, label: "Claude Spec", x: 30, y: 30 },
  { id: 3, label: "Implement", x: 50, y: 50 },
  { id: 4, label: "PR Review", x: 70, y: 30 },
  { id: 5, label: "Deploy", x: 90, y: 50 },
];

export function WorkflowDiagramVisual() {
  const [activeNode, setActiveNode] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % nodes.length);
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <svg className="absolute inset-0 w-full h-full">
        {nodes.slice(0, -1).map((node, i) => {
          const next = nodes[i + 1];
          const isActive = i <= activeNode;

          return (
            <motion.line
              key={i}
              x1={`${node.x}%`}
              y1={`${node.y}%`}
              x2={`${next.x}%`}
              y2={`${next.y}%`}
              stroke={isActive ? "rgb(59, 130, 246)" : "rgba(161, 161, 170, 0.3)"}
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{
                pathLength: isActive ? 1 : 0,
                stroke: isActive ? "rgb(59, 130, 246)" : "rgba(161, 161, 170, 0.3)"
              }}
              transition={{ duration: 0.6 }}
            />
          );
        })}
      </svg>

      <div className="relative w-full h-full">
        {nodes.map((node, i) => {
          const isActive = i <= activeNode;

          return (
            <motion.div
              key={node.id}
              className="absolute"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <motion.div
                className="relative"
                animate={{
                  scale: isActive ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  duration: 0.4,
                  times: [0, 0.5, 1],
                }}
              >
                <motion.div
                  className="w-12 h-12 rounded-full border-2 flex items-center justify-center"
                  animate={{
                    borderColor: isActive ? "rgb(59, 130, 246)" : "rgb(63, 63, 70)",
                    backgroundColor: isActive ? "rgba(59, 130, 246, 0.2)" : "rgb(24, 24, 27)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-3 h-3 rounded-full bg-gray-400"
                       style={{ backgroundColor: isActive ? "rgb(59, 130, 246)" : "rgb(161, 161, 170)" }}
                  />
                </motion.div>

                <motion.div
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium"
                  animate={{
                    color: isActive ? "rgb(212, 212, 216)" : "rgb(113, 113, 122)",
                  }}
                >
                  {node.label}
                </motion.div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
