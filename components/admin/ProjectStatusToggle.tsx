"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import toast from "react-hot-toast";
import { Id } from "@/convex/_generated/dataModel";

interface ProjectStatusToggleProps {
  projectId: Id<"projects">;
  initialStatus: "draft" | "published";
}

export function ProjectStatusToggle({ projectId, initialStatus }: ProjectStatusToggleProps) {
  const [optimisticStatus, setOptimisticStatus] = useState(initialStatus);
  const updateStatus = useMutation(api.projects.updateStatus);

  const handleToggle = async () => {
    const newStatus: "draft" | "published" = optimisticStatus === "draft" ? "published" : "draft";
    const previousStatus = optimisticStatus;

    // Optimistic update
    setOptimisticStatus(newStatus);

    try {
      await updateStatus({ id: projectId, status: newStatus });
      toast.success(`Project ${newStatus === "published" ? "published" : "set to draft"}`);
    } catch (error) {
      // Rollback on error
      setOptimisticStatus(previousStatus);
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
        optimisticStatus === "published"
          ? "bg-green-900/30 text-green-400 hover:bg-green-900/50"
          : "bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/50"
      }`}
    >
      {optimisticStatus === "published" ? "Published" : "Draft"}
    </button>
  );
}
