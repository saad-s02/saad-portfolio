"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import toast from "react-hot-toast";

interface ChangelogVisibilityToggleProps {
  entryId: Id<"changelog">;
  initialVisible: boolean;
}

export function ChangelogVisibilityToggle({
  entryId,
  initialVisible,
}: ChangelogVisibilityToggleProps) {
  const [optimisticVisible, setOptimisticVisible] = useState(initialVisible);
  const updateVisibility = useMutation(api.changelog.updateVisibility);

  const handleToggle = async () => {
    const newVisible = !optimisticVisible;

    // Optimistic update
    setOptimisticVisible(newVisible);

    try {
      await updateVisibility({
        id: entryId,
        visible: newVisible,
      });
      toast.success(`Entry ${newVisible ? "shown" : "hidden"} on public pages`);
    } catch (error) {
      // Rollback on error
      setOptimisticVisible(!newVisible);
      console.error("Failed to update visibility:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update visibility");
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
        optimisticVisible
          ? "bg-green-900/30 text-green-400 hover:bg-green-900/50"
          : "bg-gray-700 text-gray-400 hover:bg-gray-600"
      }`}
      aria-label={optimisticVisible ? "Hide from public" : "Show on public"}
    >
      {optimisticVisible ? "Visible" : "Hidden"}
    </button>
  );
}
