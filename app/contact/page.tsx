import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with me",
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-4 mb-8">
        <h1 className="text-4xl font-bold text-gray-100">Get in Touch</h1>
        <p className="text-lg text-gray-400">
          Have a question or want to work together? Send me a message.
        </p>
      </div>

      <ContactForm />

      <div className="mt-8 pt-8 border-t border-gray-800 text-center">
        <p className="text-gray-400">
          Prefer email?{" "}
          <a
            href="mailto:saad@example.com"
            className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
          >
            saad@example.com
          </a>
        </p>
      </div>
    </div>
  );
}
