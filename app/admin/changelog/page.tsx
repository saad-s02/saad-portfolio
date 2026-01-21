"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ChangelogVisibilityToggle } from "@/components/admin/ChangelogVisibilityToggle";

export default function AdminChangelogPage() {
  const entries = useQuery(api.changelog.listAll);

  if (entries === undefined) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-800 rounded w-1/4"></div>
          <div className="h-4 bg-gray-800 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Changelog</h1>
        <p className="text-gray-400 mt-1">
          Changelog entries are auto-generated on PR merge (post-v1). Toggle visibility to show/hide on public pages.
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-12 text-center">
          <p className="text-gray-400">No changelog entries yet.</p>
          <p className="text-sm text-gray-500 mt-2">
            Entries will be automatically created when PRs are merged (post-v1 feature).
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry._id}
              className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-gray-500 font-mono">{entry.date}</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        entry.type === "feature"
                          ? "bg-blue-900/30 text-blue-400"
                          : entry.type === "fix"
                          ? "bg-red-900/30 text-red-400"
                          : "bg-gray-700 text-gray-400"
                      }`}
                    >
                      {entry.type}
                    </span>
                    {entry.prNumber && (
                      <span className="text-xs text-gray-500">
                        PR #{entry.prNumber}
                      </span>
                    )}
                    {entry.commitSha && (
                      <span className="text-xs text-gray-500 font-mono">
                        {entry.commitSha.slice(0, 7)}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-100 mb-2">
                    {entry.title}
                  </h3>

                  <p className="text-gray-400 text-sm leading-relaxed">
                    {entry.summary}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <ChangelogVisibilityToggle
                    entryId={entry._id}
                    initialVisible={entry.visible}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
