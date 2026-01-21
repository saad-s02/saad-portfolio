"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResumeForm } from "./ResumeForm";

export default function AdminResumePage() {
  const resume = useQuery(api.resume.get);

  if (resume === undefined) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-800 rounded w-1/4"></div>
          <div className="h-4 bg-gray-800 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Edit Resume</h1>
        <p className="text-gray-400 mt-1">
          Manage your resume content including highlights, experience, education, and skills
        </p>
      </div>

      <ResumeForm initialData={resume || undefined} />
    </div>
  );
}
