"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import toast from "react-hot-toast";
import { useState } from "react";

interface ContactSubmissionCardProps {
  submission: {
    _id: Id<"contactSubmissions">;
    name: string;
    email: string;
    message: string;
    status: "new" | "archived";
    submittedAt: string;
  };
}

export function ContactSubmissionCard({ submission }: ContactSubmissionCardProps) {
  const updateStatus = useMutation(api.contactSubmissions.updateStatus);
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongMessage = submission.message.length > 200;

  const handleStatusChange = async (newStatus: "new" | "archived") => {
    try {
      await updateStatus({
        id: submission._id,
        status: newStatus,
      });
      toast.success(`Submission ${newStatus === "archived" ? "archived" : "restored"}`);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update status");
    }
  };

  const formattedDate = new Date(submission.submittedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors">
      {/* Header with name, email, and status */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-100">{submission.name}</h3>
          <a
            href={`mailto:${submission.email}`}
            className="text-sm text-blue-400 hover:text-blue-300 hover:underline"
          >
            {submission.email}
          </a>
        </div>

        <span
          className={`px-3 py-1 rounded text-sm font-medium flex-shrink-0 ${
            submission.status === "new"
              ? "bg-blue-900/30 text-blue-400"
              : "bg-gray-700 text-gray-400"
          }`}
        >
          {submission.status === "new" ? "New" : "Archived"}
        </span>
      </div>

      {/* Submitted date */}
      <p className="text-xs text-gray-500 mb-3">{formattedDate}</p>

      {/* Message */}
      <div className="mb-4">
        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
          {isLongMessage && !isExpanded
            ? `${submission.message.slice(0, 200)}...`
            : submission.message}
        </p>
        {isLongMessage && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-blue-400 hover:text-blue-300 mt-2"
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-3 border-t border-gray-700">
        <a
          href={`mailto:${submission.email}`}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
        >
          Email Reply
        </a>

        {submission.status === "new" ? (
          <button
            onClick={() => handleStatusChange("archived")}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-100 text-sm font-medium rounded transition-colors"
          >
            Archive
          </button>
        ) : (
          <button
            onClick={() => handleStatusChange("new")}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-100 text-sm font-medium rounded transition-colors"
          >
            Unarchive
          </button>
        )}
      </div>
    </div>
  );
}
