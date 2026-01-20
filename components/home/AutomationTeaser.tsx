import Link from "next/link";

export function AutomationTeaser() {
  return (
    <section className="bg-gray-900 rounded-lg p-8 md:p-12 border border-gray-800">
      <h2 className="text-3xl font-bold mb-4 text-gray-50">
        Automated Development Workflow
      </h2>
      <p className="text-gray-400 text-lg mb-6">
        This portfolio demonstrates a fully automated development pipeline using Claude Code:
        Issue → Spec → Implementation → PR → Claude Review → CI → Merge → Deploy → Changelog.
      </p>
      <Link
        href="/stack"
        className="inline-block px-6 py-3 bg-gray-800 hover:bg-gray-700
                   text-gray-50 rounded transition-colors"
      >
        View Stack & Automation →
      </Link>
    </section>
  );
}
