"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeSchema, type ResumeFormData } from "./schema";
import { updateResumeAction } from "./actions";
import toast from "react-hot-toast";

interface ResumeFormProps {
  initialData?: ResumeFormData;
}

export function ResumeForm({ initialData }: ResumeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: initialData || {
      highlights: [],
      experience: [],
      education: [],
      skills: [],
    },
  });

  // Field arrays for nested structures
  const {
    fields: highlightFields,
    append: appendHighlight,
    remove: removeHighlight,
  } = useFieldArray({
    control,
    name: "highlights" as any,
  });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: "experience" as any,
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education" as any,
  });

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control,
    name: "skills" as any,
  });

  const onSubmit = async (data: any) => {
    try {
      await updateResumeAction(data);
      toast.success("Resume updated successfully");
    } catch (error) {
      console.error("Failed to update resume:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update resume");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Highlights Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-100">Highlights</h2>
            <p className="text-sm text-gray-400">Key accomplishments and summary points</p>
          </div>
          <button
            type="button"
            onClick={() => appendHighlight("")}
            disabled={isSubmitting}
            className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Highlight
          </button>
        </div>
        {highlightFields.length === 0 && (
          <p className="text-sm text-gray-500 italic">No highlights added yet</p>
        )}
        {highlightFields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <div className="flex-1 space-y-1">
              <textarea
                {...register(`highlights.${index}`)}
                disabled={isSubmitting}
                rows={2}
                placeholder="e.g., 10+ years building scalable web applications"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 resize-y"
              />
              {errors.highlights?.[index] && (
                <p className="text-sm text-red-400">{errors.highlights[index]?.message}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeHighlight(index)}
              disabled={isSubmitting}
              className="px-3 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Experience Section */}
      <div className="space-y-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-100">Experience</h2>
            <p className="text-sm text-gray-400">Work history and professional roles</p>
          </div>
          <button
            type="button"
            onClick={() =>
              appendExperience({
                role: "",
                company: "",
                period: "",
                description: "",
                achievements: [],
              })
            }
            disabled={isSubmitting}
            className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Experience
          </button>
        </div>
        {experienceFields.length === 0 && (
          <p className="text-sm text-gray-500 italic">No experience added yet</p>
        )}
        {experienceFields.map((field, expIndex) => (
          <div key={field.id} className="p-4 bg-gray-900 border border-gray-700 rounded-lg space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-medium text-gray-300">Experience Entry #{expIndex + 1}</h3>
              <button
                type="button"
                onClick={() => removeExperience(expIndex)}
                disabled={isSubmitting}
                className="px-2 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-400">
                  Role <span className="text-red-400">*</span>
                </label>
                <input
                  {...register(`experience.${expIndex}.role`)}
                  disabled={isSubmitting}
                  placeholder="Senior Engineer"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                {errors.experience?.[expIndex]?.role && (
                  <p className="text-xs text-red-400">{errors.experience[expIndex]?.role?.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-400">
                  Company <span className="text-red-400">*</span>
                </label>
                <input
                  {...register(`experience.${expIndex}.company`)}
                  disabled={isSubmitting}
                  placeholder="Tech Corp"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                {errors.experience?.[expIndex]?.company && (
                  <p className="text-xs text-red-400">{errors.experience[expIndex]?.company?.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-400">
                Period <span className="text-red-400">*</span>
              </label>
              <input
                {...register(`experience.${expIndex}.period`)}
                disabled={isSubmitting}
                placeholder="2020-2024"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              {errors.experience?.[expIndex]?.period && (
                <p className="text-xs text-red-400">{errors.experience[expIndex]?.period?.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-400">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                {...register(`experience.${expIndex}.description`)}
                disabled={isSubmitting}
                rows={3}
                placeholder="Led team of 5 engineers building..."
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 resize-y"
              />
              {errors.experience?.[expIndex]?.description && (
                <p className="text-xs text-red-400">{errors.experience[expIndex]?.description?.message}</p>
              )}
            </div>

            {/* Nested achievements array */}
            <ExperienceAchievements
              expIndex={expIndex}
              control={control}
              register={register}
              errors={errors}
              isSubmitting={isSubmitting}
            />
          </div>
        ))}
      </div>

      {/* Education Section */}
      <div className="space-y-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-100">Education</h2>
            <p className="text-sm text-gray-400">Academic credentials and degrees</p>
          </div>
          <button
            type="button"
            onClick={() =>
              appendEducation({
                degree: "",
                institution: "",
                year: "",
              })
            }
            disabled={isSubmitting}
            className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Education
          </button>
        </div>
        {educationFields.length === 0 && (
          <p className="text-sm text-gray-500 italic">No education added yet</p>
        )}
        {educationFields.map((field, index) => (
          <div key={field.id} className="p-4 bg-gray-900 border border-gray-700 rounded-lg space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-medium text-gray-300">Education Entry #{index + 1}</h3>
              <button
                type="button"
                onClick={() => removeEducation(index)}
                disabled={isSubmitting}
                className="px-2 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Remove
              </button>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-400">
                Degree <span className="text-red-400">*</span>
              </label>
              <input
                {...register(`education.${index}.degree`)}
                disabled={isSubmitting}
                placeholder="BS Computer Science"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              {errors.education?.[index]?.degree && (
                <p className="text-xs text-red-400">{errors.education[index]?.degree?.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-400">
                Institution <span className="text-red-400">*</span>
              </label>
              <input
                {...register(`education.${index}.institution`)}
                disabled={isSubmitting}
                placeholder="University Name"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              {errors.education?.[index]?.institution && (
                <p className="text-xs text-red-400">{errors.education[index]?.institution?.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-400">
                Year <span className="text-red-400">*</span>
              </label>
              <input
                {...register(`education.${index}.year`)}
                disabled={isSubmitting}
                placeholder="2015"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              {errors.education?.[index]?.year && (
                <p className="text-xs text-red-400">{errors.education[index]?.year?.message}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Skills Section */}
      <div className="space-y-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-100">Skills</h2>
            <p className="text-sm text-gray-400">Technical skills organized by category</p>
          </div>
          <button
            type="button"
            onClick={() =>
              appendSkill({
                category: "",
                items: [],
              })
            }
            disabled={isSubmitting}
            className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Skill Category
          </button>
        </div>
        {skillFields.length === 0 && (
          <p className="text-sm text-gray-500 italic">No skills added yet</p>
        )}
        {skillFields.map((field, skillIndex) => (
          <div key={field.id} className="p-4 bg-gray-900 border border-gray-700 rounded-lg space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-medium text-gray-300">Skill Category #{skillIndex + 1}</h3>
              <button
                type="button"
                onClick={() => removeSkill(skillIndex)}
                disabled={isSubmitting}
                className="px-2 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Remove
              </button>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-400">
                Category <span className="text-red-400">*</span>
              </label>
              <input
                {...register(`skills.${skillIndex}.category`)}
                disabled={isSubmitting}
                placeholder="Frontend Development"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              {errors.skills?.[skillIndex]?.category && (
                <p className="text-xs text-red-400">{errors.skills[skillIndex]?.category?.message}</p>
              )}
            </div>

            {/* Nested items array */}
            <SkillItems
              skillIndex={skillIndex}
              control={control}
              register={register}
              errors={errors}
              isSubmitting={isSubmitting}
            />
          </div>
        ))}
      </div>

      {/* Submit button */}
      <div className="flex items-center gap-3 pt-6 border-t border-gray-700">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save Resume"}
        </button>
      </div>
    </form>
  );
}

// Helper component for nested achievements
function ExperienceAchievements({
  expIndex,
  control,
  register,
  errors,
  isSubmitting,
}: {
  expIndex: number;
  control: any;
  register: any;
  errors: any;
  isSubmitting: boolean;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `experience.${expIndex}.achievements` as any,
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-gray-400">Achievements</label>
        <button
          type="button"
          onClick={() => append("")}
          disabled={isSubmitting}
          className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-100 rounded disabled:opacity-50"
        >
          Add Achievement
        </button>
      </div>
      {fields.length === 0 && (
        <p className="text-xs text-gray-500 italic">No achievements added</p>
      )}
      {fields.map((field, achIndex) => (
        <div key={field.id} className="flex gap-2">
          <input
            {...register(`experience.${expIndex}.achievements.${achIndex}`)}
            disabled={isSubmitting}
            placeholder="Shipped feature X"
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => remove(achIndex)}
            disabled={isSubmitting}
            className="px-2 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded text-xs disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

// Helper component for nested skill items
function SkillItems({
  skillIndex,
  control,
  register,
  errors,
  isSubmitting,
}: {
  skillIndex: number;
  control: any;
  register: any;
  errors: any;
  isSubmitting: boolean;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `skills.${skillIndex}.items` as any,
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-gray-400">
          Skills <span className="text-red-400">*</span>
        </label>
        <button
          type="button"
          onClick={() => append("")}
          disabled={isSubmitting}
          className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-100 rounded disabled:opacity-50"
        >
          Add Skill
        </button>
      </div>
      {fields.length === 0 && (
        <p className="text-xs text-gray-500 italic">No skills added</p>
      )}
      {fields.map((field, itemIndex) => (
        <div key={field.id} className="flex gap-2">
          <input
            {...register(`skills.${skillIndex}.items.${itemIndex}`)}
            disabled={isSubmitting}
            placeholder="React, Next.js, TypeScript"
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => remove(itemIndex)}
            disabled={isSubmitting}
            className="px-2 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded text-xs disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
