"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function AdminPanelVisual() {
  const [isDraft, setIsDraft] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsDraft((prev) => !prev);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full max-w-md bg-gray-900 rounded-lg border border-gray-700 overflow-hidden shadow-2xl">
        {/* Browser chrome */}
        <div className="bg-gray-800 px-4 py-2 flex items-center gap-2 border-b border-gray-700">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex-1 mx-4 bg-gray-900 rounded px-3 py-1 text-xs text-gray-400">
            localhost:3000/admin/projects
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-1">Project Title</div>
            <div className="bg-gray-800 rounded px-3 py-2 text-gray-300 text-sm">
              AI Workflow Automation
            </div>
          </div>

          <div className="mb-6">
            <div className="text-sm text-gray-400 mb-2">Status</div>
            <div className="flex items-center gap-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDraft ? "draft" : "published"}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    isDraft
                      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      : "bg-green-500/20 text-green-400 border border-green-500/30"
                  }`}
                >
                  {isDraft ? "● Draft" : "● Published"}
                </motion.div>
              </AnimatePresence>

              <motion.button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDraft(!isDraft)}
              >
                {isDraft ? "Publish" : "Unpublish"}
              </motion.button>
            </div>
          </div>

          <motion.div
            className="text-xs text-gray-500 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-green-500"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.6, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            Real-time sync enabled
          </motion.div>
        </div>
      </div>
    </div>
  );
}
