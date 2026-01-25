"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

// Data flow architecture showing the actual request journey
// Positions are percentages within the container
const flowStages = [
  {
    id: "user",
    label: "User",
    description: "Request origin",
    position: { x: 50, y: 12 },
    size: 48,
    type: "entry",
  },
  {
    id: "nextjs",
    label: "Next.js",
    description: "App Router + SSR",
    position: { x: 50, y: 50 },
    size: 72,
    type: "core",
  },
  {
    id: "convex",
    label: "Convex",
    description: "Real-time data",
    position: { x: 80, y: 50 },
    size: 52,
    type: "backend",
  },
  {
    id: "workos",
    label: "WorkOS",
    description: "Authentication",
    position: { x: 20, y: 50 },
    size: 52,
    type: "backend",
  },
  {
    id: "vercel",
    label: "Vercel",
    description: "Edge deployment",
    position: { x: 50, y: 88 },
    size: 48,
    type: "infra",
  },
];

// Data flow paths showing the journey
const flowPaths = [
  { from: "user", to: "nextjs", label: "request", color: "blue" },
  { from: "nextjs", to: "convex", label: "query", color: "purple" },
  { from: "nextjs", to: "workos", label: "auth", color: "emerald" },
  { from: "nextjs", to: "vercel", label: "deploy", color: "pink" },
];

// Edge padding to prevent lines from touching node borders
const EDGE_PADDING = 8;
// Perpendicular offset for labels
const LABEL_OFFSET = 14;

// Custom hook for container dimensions
function useContainerSize(ref: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const updateSize = () => {
      if (ref.current) {
        setSize({
          width: ref.current.offsetWidth,
          height: ref.current.offsetHeight,
        });
      }
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref]);

  return size;
}

// Calculate pixel positions from percentages
function getPixelPosition(
  stage: (typeof flowStages)[0],
  containerWidth: number,
  containerHeight: number
) {
  return {
    x: (stage.position.x / 100) * containerWidth,
    y: (stage.position.y / 100) * containerHeight,
  };
}

// Calculate adjusted line endpoints that stop at node edges
function getAdjustedEndpoints(
  from: (typeof flowStages)[0],
  to: (typeof flowStages)[0],
  containerWidth: number,
  containerHeight: number
) {
  const fromPos = getPixelPosition(from, containerWidth, containerHeight);
  const toPos = getPixelPosition(to, containerWidth, containerHeight);

  // Direction vector
  const dx = toPos.x - fromPos.x;
  const dy = toPos.y - fromPos.y;
  const length = Math.sqrt(dx * dx + dy * dy);

  if (length === 0) return { start: fromPos, end: toPos, midpoint: fromPos, perpX: 0, perpY: -1 };

  // Unit vector
  const ux = dx / length;
  const uy = dy / length;

  // Perpendicular vector (for label offset)
  const perpX = -uy;
  const perpY = ux;

  // Radii with padding
  const fromRadius = from.size / 2 + EDGE_PADDING;
  const toRadius = to.size / 2 + EDGE_PADDING;

  // Adjusted start and end points
  const start = {
    x: fromPos.x + ux * fromRadius,
    y: fromPos.y + uy * fromRadius,
  };
  const end = {
    x: toPos.x - ux * toRadius,
    y: toPos.y - uy * toRadius,
  };

  // Midpoint of the adjusted line
  const midpoint = {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2,
  };

  return { start, end, midpoint, perpX, perpY };
}

// Tech icons
function TechIcon({ tech, size }: { tech: string; size: number }) {
  const icons: Record<string, React.ReactElement> = {
    user: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-300" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    nextjs: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="text-white">
        <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.572 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z" />
      </svg>
    ),
    vercel: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="text-white">
        <path d="M24 22.525H0l12-21.05 12 21.05z" />
      </svg>
    ),
    convex: (
      <svg viewBox="0 0 24 24" className="text-white" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    workos: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path strokeLinecap="round" d="M12 6v6l4 2" />
      </svg>
    ),
  };

  return (
    <div style={{ width: size, height: size }} className="flex items-center justify-center">
      {icons[tech] || icons.nextjs}
    </div>
  );
}

// Data particle component for animated flow
const PARTICLE_SIZE = 8; // w-2 h-2 = 8px

function DataParticle({
  startX,
  startY,
  endX,
  endY,
  delay,
  color,
}: {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  delay: number;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-400",
    purple: "bg-purple-400",
    emerald: "bg-emerald-400",
    pink: "bg-pink-400",
  };

  // Center the particle on the line by offsetting by half its size
  const offset = PARTICLE_SIZE / 2;
  const sx = startX - offset;
  const sy = startY - offset;
  const ex = endX - offset;
  const ey = endY - offset;

  return (
    <motion.div
      className={`absolute w-2 h-2 rounded-full ${colorMap[color]} shadow-lg`}
      style={{
        left: 0,
        top: 0,
        x: sx,
        y: sy,
        zIndex: 5,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1, 1, 0.5],
        x: [sx, ex],
        y: [sy, ey],
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        repeatDelay: 1,
        ease: "easeInOut",
      }}
    />
  );
}

// Connection line component
function ConnectionLine({
  start,
  end,
  midpoint,
  perpX,
  perpY,
  label,
  color,
  isActive,
  index,
}: {
  start: { x: number; y: number };
  end: { x: number; y: number };
  midpoint: { x: number; y: number };
  perpX: number;
  perpY: number;
  label: string;
  color: string;
  isActive: boolean;
  index: number;
}) {
  const colorMap: Record<string, { line: string; glow: string }> = {
    blue: { line: "rgba(96, 165, 250, 0.6)", glow: "rgba(96, 165, 250, 0.8)" },
    purple: { line: "rgba(192, 132, 252, 0.6)", glow: "rgba(192, 132, 252, 0.8)" },
    emerald: { line: "rgba(52, 211, 153, 0.6)", glow: "rgba(52, 211, 153, 0.8)" },
    pink: { line: "rgba(244, 114, 182, 0.6)", glow: "rgba(244, 114, 182, 0.8)" },
  };

  const colors = colorMap[color] || colorMap.blue;

  // Determine if line is more vertical or horizontal
  const isVertical = Math.abs(end.y - start.y) > Math.abs(end.x - start.x);

  // Label offset: push labels away from line perpendicular to direction
  // For horizontal lines: offset above (negative Y)
  // For vertical lines: offset to the side (positive X)
  const labelX = midpoint.x + perpX * LABEL_OFFSET;
  const labelY = midpoint.y + perpY * LABEL_OFFSET;

  return (
    <g>
      {/* Main line */}
      <motion.line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke={isActive ? colors.line : "rgba(113, 113, 122, 0.2)"}
        strokeWidth={isActive ? 2 : 1}
        strokeDasharray="6 4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: 1,
          opacity: isActive ? 1 : 0.3,
          strokeDashoffset: isActive ? [0, -10] : 0,
        }}
        transition={{
          pathLength: { duration: 0.8, delay: index * 0.2 },
          opacity: { duration: 0.3 },
          strokeDashoffset: { duration: 1.5, repeat: Infinity, ease: "linear" },
        }}
      />
      {/* Subtle glow endpoint markers */}
      <motion.circle
        cx={start.x}
        cy={start.y}
        r={3}
        fill={isActive ? colors.glow : "transparent"}
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 0.6 : 0 }}
        transition={{ delay: index * 0.2 + 0.5 }}
      />
      <motion.circle
        cx={end.x}
        cy={end.y}
        r={3}
        fill={isActive ? colors.glow : "transparent"}
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 0.6 : 0 }}
        transition={{ delay: index * 0.2 + 0.5 }}
      />
    </g>
  );
}

// Path label component (rendered as HTML for better styling)
function PathLabel({
  x,
  y,
  label,
  isActive,
  index,
}: {
  x: number;
  y: number;
  label: string;
  isActive: boolean;
  index: number;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        zIndex: 3,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0.4 }}
      transition={{ duration: 0.3, delay: index * 0.2 + 0.5 }}
    >
      <span className="text-[10px] font-mono text-gray-500 bg-gray-900/80 px-1.5 py-0.5 rounded">
        {label}
      </span>
    </motion.div>
  );
}

export function TechStackVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowParticles(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const isPathActive = useCallback(
    (from: string, to: string) => {
      if (!hoveredNode) return true;
      return from === hoveredNode || to === hoveredNode;
    },
    [hoveredNode]
  );

  // Calculate all path geometries
  const pathGeometries = flowPaths.map((path) => {
    const from = flowStages.find((s) => s.id === path.from);
    const to = flowStages.find((s) => s.id === path.to);
    if (!from || !to || containerWidth === 0) return null;

    return {
      ...path,
      ...getAdjustedEndpoints(from, to, containerWidth, containerHeight),
    };
  });

  return (
    <div ref={containerRef} className="w-full h-[420px] relative">
      {/* SVG layer for connection lines - behind everything */}
      {containerWidth > 0 && (
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 1, pointerEvents: "none" }}
        >
          {pathGeometries.map((geom, i) => {
            if (!geom) return null;
            const isActive = isPathActive(geom.from, geom.to);
            return (
              <ConnectionLine
                key={`line-${geom.from}-${geom.to}`}
                start={geom.start}
                end={geom.end}
                midpoint={geom.midpoint}
                perpX={geom.perpX}
                perpY={geom.perpY}
                label={geom.label}
                color={geom.color}
                isActive={isActive}
                index={i}
              />
            );
          })}
        </svg>
      )}

      {/* Path labels - rendered as HTML for better styling */}
      {containerWidth > 0 &&
        pathGeometries.map((geom, i) => {
          if (!geom) return null;
          const isActive = isPathActive(geom.from, geom.to);

          // For vertical lines (request, deploy), position label to the left with small offset
          // For horizontal lines (auth, query), use perpendicular offset above the line
          const isVertical = geom.label === "request" || geom.label === "deploy";
          const labelX = isVertical
            ? geom.midpoint.x - 30  // Left of the vertical line
            : geom.midpoint.x + geom.perpX * LABEL_OFFSET;
          const labelY = isVertical
            ? geom.midpoint.y  // Centered on the line
            : geom.midpoint.y + geom.perpY * LABEL_OFFSET;

          return (
            <PathLabel
              key={`label-${geom.from}-${geom.to}`}
              x={labelX}
              y={labelY}
              label={geom.label}
              isActive={isActive}
              index={i}
            />
          );
        })}

      {/* Animated data particles - follow adjusted endpoints */}
      {showParticles &&
        containerWidth > 0 &&
        pathGeometries.map((geom, i) => {
          if (!geom) return null;
          return Array.from({ length: 2 }).map((_, j) => (
            <DataParticle
              key={`particle-${geom.from}-${geom.to}-${j}`}
              startX={geom.start.x}
              startY={geom.start.y}
              endX={geom.end.x}
              endY={geom.end.y}
              delay={i * 0.5 + j * 1}
              color={geom.color}
            />
          ));
        })}

      {/* Tech stack nodes - on top of everything */}
      {flowStages.map((stage, i) => {
        const isHovered = hoveredNode === stage.id;
        const isHighlighted =
          !hoveredNode ||
          hoveredNode === stage.id ||
          flowPaths.some(
            (p) =>
              (p.from === hoveredNode && p.to === stage.id) ||
              (p.to === hoveredNode && p.from === stage.id)
          );
        const isCore = stage.type === "core";

        return (
          <motion.div
            key={stage.id}
            className="absolute cursor-pointer"
            style={{
              left: `${stage.position.x}%`,
              top: `${stage.position.y}%`,
              zIndex: isCore ? 20 : 10,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: isHighlighted ? 1 : 0.4,
              scale: 1,
            }}
            transition={{
              opacity: { duration: 0.3 },
              scale: { delay: i * 0.12, duration: 0.5, type: "spring", stiffness: 150 },
            }}
            onMouseEnter={() => setHoveredNode(stage.id)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {/* Pulsing glow for core - positioned behind the card */}
            {isCore && (
              <motion.div
                className="absolute rounded-2xl bg-blue-500/20 blur-2xl pointer-events-none"
                style={{
                  width: stage.size + 24,
                  height: stage.size + 24,
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: -1,
                }}
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}

            {/* Node card - centered at the position point */}
            <motion.div
              className={`relative flex items-center justify-center rounded-2xl backdrop-blur-sm ${
                isCore
                  ? "bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-2 border-gray-600"
                  : stage.type === "entry"
                    ? "bg-gray-800/60 border border-gray-600"
                    : "bg-gray-800/80 border border-gray-700"
              }`}
              style={{
                width: stage.size,
                height: stage.size,
                padding: isCore ? 14 : 10,
              }}
              // Preserve centering transform while allowing Framer Motion scale
              transformTemplate={(_, generated) => `translate(-50%, -50%) ${generated}`}
              whileHover={{ scale: 1.08 }}
              animate={{
                borderColor: isHovered
                  ? "rgb(139, 92, 246)"
                  : isCore
                    ? "rgb(107, 114, 128)"
                    : "rgb(75, 85, 99)",
                boxShadow: isHovered
                  ? "0 0 25px rgba(139, 92, 246, 0.4)"
                  : isCore
                    ? "0 0 20px rgba(59, 130, 246, 0.15)"
                    : "none",
              }}
              transition={{ duration: 0.2 }}
            >
              <TechIcon tech={stage.id} size={isCore ? 36 : stage.type === "entry" ? 22 : 26} />
            </motion.div>

            {/* Label positioning based on node location */}
            <motion.div
              className="absolute flex flex-col"
              style={{
                // User: left of node, right-aligned text
                ...(stage.id === "user" && {
                  left: -stage.size / 2 - 12,
                  top: 0,
                  transform: "translate(-100%, -50%)",
                  alignItems: "flex-end",
                }),
                // Vercel: right of node, left-aligned text
                ...(stage.id === "vercel" && {
                  left: stage.size / 2 + 12,
                  top: 0,
                  transform: "translateY(-50%)",
                  alignItems: "flex-start",
                }),
                // WorkOS: below node, centered
                ...(stage.id === "workos" && {
                  left: 0,
                  top: stage.size / 2 + 8,
                  transform: "translateX(-50%)",
                  alignItems: "center",
                }),
                // Convex: above node, centered
                ...(stage.id === "convex" && {
                  left: 0,
                  top: -stage.size / 2 - 8,
                  transform: "translate(-50%, -100%)",
                  alignItems: "center",
                }),
                // Next.js (core): below node, centered
                ...(stage.id === "nextjs" && {
                  left: 0,
                  top: stage.size / 2 + 8,
                  transform: "translateX(20%)",
                  alignItems: "center",
                }),
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.12 + 0.3 }}
            >
              {/* Convex: reverse order (description then label) since it's above */}
              {stage.id === "convex" ? (
                <>
                  <span className="text-[9px] text-gray-600 font-mono whitespace-nowrap">
                    {stage.description}
                  </span>
                  <span className="text-xs font-semibold whitespace-nowrap text-gray-400">
                    {stage.label}
                  </span>
                </>
              ) : (
                <>
                  <span
                    className={`text-xs font-semibold whitespace-nowrap ${
                      isCore ? "text-gray-200" : "text-gray-400"
                    }`}
                  >
                    {stage.label}
                  </span>
                  <span className="text-[9px] text-gray-600 font-mono whitespace-nowrap">
                    {stage.description}
                  </span>
                </>
              )}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
