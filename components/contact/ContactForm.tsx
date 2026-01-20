"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactFormData } from "@/lib/validations/contact";
import toast from "react-hot-toast";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ConvexError } from "convex/values";

export function ContactForm() {
  const submitContact = useMutation(api.contact.submit);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      website: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await submitContact({
        name: data.name,
        email: data.email,
        message: data.message,
        honeypot: data.website || "",
      });
      toast.success("Message sent successfully! I'll get back to you soon.");
      reset();
    } catch (error) {
      if (error instanceof ConvexError) {
        const msg = (error.data as { message: string }).message;
        toast.error(msg || "Failed to send message. Please try again.");
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred. Please try the email link below.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Honeypot field - hidden from users but visible to bots */}
      <input
        type="text"
        {...register("website")}
        tabIndex={-1}
        autoComplete="off"
        style={{
          opacity: 0,
          position: "absolute",
          top: 0,
          left: 0,
          height: 0,
          width: 0,
          zIndex: -1,
        }}
        aria-hidden="true"
      />

      {/* Name field */}
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-gray-300">
          Name <span className="text-red-400">*</span>
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          disabled={isSubmitting}
          aria-invalid={errors.name ? "true" : "false"}
          aria-describedby={errors.name ? "name-error" : undefined}
          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Your name"
        />
        {errors.name && (
          <p id="name-error" role="alert" className="text-sm text-red-400">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email field */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
          Email <span className="text-red-400">*</span>
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          disabled={isSubmitting}
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="your.email@example.com"
        />
        {errors.email && (
          <p id="email-error" role="alert" className="text-sm text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Message field */}
      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-medium text-gray-300">
          Message <span className="text-red-400">*</span>
        </label>
        <textarea
          id="message"
          rows={6}
          {...register("message")}
          disabled={isSubmitting}
          aria-invalid={errors.message ? "true" : "false"}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-y"
          placeholder="Your message..."
        />
        {errors.message && (
          <p id="message-error" role="alert" className="text-sm text-red-400">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
