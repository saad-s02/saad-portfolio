"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ContactSubmissionCard } from "@/components/admin/ContactSubmissionCard";
import { useState } from "react";

type FilterTab = "all" | "new" | "archived";

export default function AdminContactPage() {
  const submissions = useQuery(api.contactSubmissions.listAll);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");

  if (submissions === undefined) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-800 rounded w-1/4"></div>
          <div className="h-4 bg-gray-800 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  // Filter submissions based on active tab
  const filteredSubmissions =
    activeFilter === "all"
      ? submissions
      : submissions.filter((s) => s.status === activeFilter);

  // Sort by submittedAt descending (newest first)
  const sortedSubmissions = [...filteredSubmissions].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );

  // Count by status for tab badges
  const newCount = submissions.filter((s) => s.status === "new").length;
  const archivedCount = submissions.filter((s) => s.status === "archived").length;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Contact Submissions</h1>
        <p className="text-gray-400 mt-1">
          Manage contact form submissions from your portfolio site.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-gray-700">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeFilter === "all"
              ? "border-blue-500 text-blue-400"
              : "border-transparent text-gray-400 hover:text-gray-300"
          }`}
        >
          All ({submissions.length})
        </button>
        <button
          onClick={() => setActiveFilter("new")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeFilter === "new"
              ? "border-blue-500 text-blue-400"
              : "border-transparent text-gray-400 hover:text-gray-300"
          }`}
        >
          New ({newCount})
        </button>
        <button
          onClick={() => setActiveFilter("archived")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeFilter === "archived"
              ? "border-blue-500 text-blue-400"
              : "border-transparent text-gray-400 hover:text-gray-300"
          }`}
        >
          Archived ({archivedCount})
        </button>
      </div>

      {/* Submissions list */}
      {sortedSubmissions.length === 0 ? (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-12 text-center">
          <p className="text-gray-400">
            {activeFilter === "all"
              ? "No contact submissions yet."
              : `No ${activeFilter} submissions.`}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {activeFilter === "all"
              ? "Submissions from the contact form will appear here."
              : `Switch to another tab to see ${
                  activeFilter === "new" ? "archived" : "new"
                } submissions.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedSubmissions.map((submission) => (
            <ContactSubmissionCard key={submission._id} submission={submission} />
          ))}
        </div>
      )}
    </div>
  );
}
