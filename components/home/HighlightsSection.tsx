export function HighlightsSection() {
  const highlights = [
    "End-to-end automated portfolio with Claude Code workflow integration",
    "Full-stack development with Next.js, TypeScript, Convex, and WorkOS",
    "AI-powered development workflows for faster iteration and deployment",
    "Dark minimalist design with Framer Motion animations",
    "Real-time admin panel with draft/publish workflow",
  ];

  return (
    <section>
      <h2 className="text-3xl font-bold mb-8 text-gray-50">Highlights</h2>
      <ul className="space-y-4">
        {highlights.map((highlight, i) => (
          <li key={i} className="flex items-start">
            <span className="text-gray-500 mr-3">→</span>
            <span className="text-gray-300 text-lg">{highlight}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
