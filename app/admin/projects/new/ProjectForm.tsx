"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, type ProjectFormData } from "./schema";
import { createProjectAction } from "./actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function ProjectForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      slug: "",
      summary: "",
      content: "",
      status: "draft",
      featured: false,
      stack: [],
      tags: [],
      links: [],
      screenshots: [],
    },
  });

  const { fields: linkFields, append: appendLink, remove: removeLink } = useFieldArray({
    control,
    name: "links",
  });

  const onSubmit = async (data: ProjectFormData) => {
    try {
      // Parse comma-separated strings into arrays
      const stackInput = (data.stack as unknown as string);
      const tagsInput = (data.tags as unknown as string);
      const screenshotsInput = (data.screenshots as unknown as string);

      const formattedData: ProjectFormData = {
        ...data,
        stack: typeof stackInput === 'string'
          ? stackInput.split(',').map(s => s.trim()).filter(Boolean)
          : data.stack,
        tags: typeof tagsInput === 'string'
          ? tagsInput.split(',').map(s => s.trim()).filter(Boolean)
          : data.tags,
        screenshots: typeof screenshotsInput === 'string'
          ? screenshotsInput.split('\n').map(s => s.trim()).filter(Boolean)
          : data.screenshots,
      };

      await createProjectAction(formattedData);
      toast.success("Project created successfully");
      router.push("/admin/projects");
    } catch (error) {
      console.error("Failed to create project:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create project");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-gray-300">
          Title <span className="text-red-400">*</span>
        </label>
        <input
          id="title"
          type="text"
          {...register("title")}
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Project title"
        />
        {errors.title && (
          <p className="text-sm text-red-400">{errors.title.message}</p>
        )}
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <label htmlFor="slug" className="block text-sm font-medium text-gray-300">
          Slug <span className="text-red-400">*</span>
        </label>
        <input
          id="slug"
          type="text"
          {...register("slug")}
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="project-slug"
        />
        <p className="text-xs text-gray-500">
          URL-friendly identifier (lowercase, numbers, hyphens only)
        </p>
        {errors.slug && (
          <p className="text-sm text-red-400">{errors.slug.message}</p>
        )}
      </div>

      {/* Summary */}
      <div className="space-y-2">
        <label htmlFor="summary" className="block text-sm font-medium text-gray-300">
          Summary <span className="text-red-400">*</span>
        </label>
        <textarea
          id="summary"
          rows={3}
          {...register("summary")}
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-y"
          placeholder="Brief project description"
        />
        {errors.summary && (
          <p className="text-sm text-red-400">{errors.summary.message}</p>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <label htmlFor="content" className="block text-sm font-medium text-gray-300">
          Content <span className="text-red-400">*</span>
        </label>
        <textarea
          id="content"
          rows={12}
          {...register("content")}
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-y"
          placeholder="Full project content in Markdown..."
        />
        <p className="text-xs text-gray-500">
          Use Markdown formatting. Supports sections like ## Problem, ## Approach, ## Impact
        </p>
        {errors.content && (
          <p className="text-sm text-red-400">{errors.content.message}</p>
        )}
      </div>

      {/* Status */}
      <div className="space-y-2">
        <label htmlFor="status" className="block text-sm font-medium text-gray-300">
          Status <span className="text-red-400">*</span>
        </label>
        <select
          id="status"
          {...register("status")}
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        {errors.status && (
          <p className="text-sm text-red-400">{errors.status.message}</p>
        )}
      </div>

      {/* Featured */}
      <div className="flex items-center space-x-2">
        <input
          id="featured"
          type="checkbox"
          {...register("featured")}
          disabled={isSubmitting}
          className="w-4 h-4 bg-gray-900 border-gray-700 rounded text-blue-600 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <label htmlFor="featured" className="text-sm font-medium text-gray-300">
          Featured project (shown on home page)
        </label>
      </div>

      {/* Stack */}
      <div className="space-y-2">
        <label htmlFor="stack" className="block text-sm font-medium text-gray-300">
          Tech Stack <span className="text-red-400">*</span>
        </label>
        <textarea
          id="stack"
          rows={2}
          {...register("stack" as any)}
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-y"
          placeholder="Next.js, TypeScript, Tailwind CSS"
        />
        <p className="text-xs text-gray-500">
          Comma-separated list of technologies
        </p>
        {errors.stack && (
          <p className="text-sm text-red-400">{errors.stack.message}</p>
        )}
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <label htmlFor="tags" className="block text-sm font-medium text-gray-300">
          Tags
        </label>
        <textarea
          id="tags"
          rows={2}
          {...register("tags" as any)}
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-y"
          placeholder="web, automation, ai"
        />
        <p className="text-xs text-gray-500">
          Comma-separated tags (optional)
        </p>
        {errors.tags && (
          <p className="text-sm text-red-400">{errors.tags.message}</p>
        )}
      </div>

      {/* Links */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-300">Links</label>
          <button
            type="button"
            onClick={() => appendLink({ label: "", url: "" })}
            disabled={isSubmitting}
            className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Link
          </button>
        </div>
        {linkFields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <div className="flex-1 space-y-1">
              <input
                {...register(`links.${index}.label`)}
                disabled={isSubmitting}
                placeholder="Label (e.g., Live Site)"
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              />
              {errors.links?.[index]?.label && (
                <p className="text-xs text-red-400">
                  {errors.links[index]?.label?.message}
                </p>
              )}
            </div>
            <div className="flex-1 space-y-1">
              <input
                {...register(`links.${index}.url`)}
                disabled={isSubmitting}
                placeholder="URL"
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              />
              {errors.links?.[index]?.url && (
                <p className="text-xs text-red-400">
                  {errors.links[index]?.url?.message}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeLink(index)}
              disabled={isSubmitting}
              className="px-3 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Remove
            </button>
          </div>
        ))}
        <p className="text-xs text-gray-500">
          Add relevant links (e.g., live demo, repository, case study)
        </p>
      </div>

      {/* Screenshots */}
      <div className="space-y-2">
        <label htmlFor="screenshots" className="block text-sm font-medium text-gray-300">
          Screenshots
        </label>
        <textarea
          id="screenshots"
          rows={3}
          {...register("screenshots" as any)}
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-y"
          placeholder="https://example.com/screenshot1.png"
        />
        <p className="text-xs text-gray-500">
          One URL per line (optional)
        </p>
        {errors.screenshots && (
          <p className="text-sm text-red-400">{errors.screenshots.message}</p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-700">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating..." : "Create Project"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-100 font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
