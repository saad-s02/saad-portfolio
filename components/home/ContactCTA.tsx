import Link from "next/link";
import { FadeIn } from "@/components/animations/FadeIn";

export function ContactCTA() {
  return (
    <FadeIn delay={0.3}>
      <section className="text-center py-16">
        <h2 className="text-3xl font-bold mb-6 text-gray-50">
          Let&apos;s Build Something Together
        </h2>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
          Interested in automated workflows, modern web development, or AI-assisted engineering?
          I&apos;d love to hear from you.
        </p>
        <Link
          href="/contact"
          className="inline-block px-8 py-4 bg-gray-800 hover:bg-gray-700
                     text-gray-50 rounded-lg text-lg transition-colors"
        >
          Get in Touch
        </Link>
      </section>
    </FadeIn>
  );
}
