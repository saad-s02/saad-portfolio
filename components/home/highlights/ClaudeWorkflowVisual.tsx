"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function ClaudeWorkflowVisual() {
  const [step, setStep] = useState(0);

  const steps = [
    { text: "$ claude review", delay: 0 },
    { text: "✓ Review passed", delay: 1500 },
    { text: "$ git push origin main", delay: 3000 },
    { text: "✓ Deployed to production", delay: 4500 },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 5); // 4 steps + 1 reset
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const visibleSteps = step === 4 ? [] : steps.slice(0, step + 1);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full max-w-md bg-gray-900 rounded-lg border border-gray-700 overflow-hidden shadow-2xl">
        {/* Terminal header */}
        <div className="bg-gray-800 px-4 py-2 flex items-center gap-2 border-b border-gray-700">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-gray-400 text-sm ml-2">terminal</span>
        </div>

        {/* Terminal content */}
        <div className="p-4 font-mono text-sm min-h-[180px]">
          <AnimatePresence mode="wait">
            {visibleSteps.length === 0 ? (
              <motion.div
                key="cursor"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center"
              >
                <span className="text-green-400">→</span>
                <motion.span
                  className="ml-2 w-2 h-4 bg-gray-300"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {visibleSteps.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.3 }}
                    className="flex items-start"
                  >
                    <span className={s.text.startsWith("✓") ? "text-green-400" : "text-gray-300"}>
                      {s.text.startsWith("✓") ? "→ " : "$ "}
                      {s.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
