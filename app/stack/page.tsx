import { FadeIn } from "@/components/animations/FadeIn";

export const metadata = {
  title: "Stack & Automation",
  description: "Technical architecture and automated development workflow using Claude Code, GitHub Actions, Next.js, Convex, and CI/CD. Issue to production in minutes.",
  openGraph: {
    title: "Stack & Automation",
    description: "Technical architecture and automated development workflow using Claude Code, GitHub Actions, and CI/CD.",
    type: 'website',
    url: 'https://saadsiddiqui.dev/stack',
  },
  alternates: {
    canonical: 'https://saadsiddiqui.dev/stack',
  },
};

export default function StackPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-16">
      <FadeIn>
        <section>
          <h1 className="text-4xl font-bold mb-6 text-gray-50">
            Stack & Automation
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            This portfolio demonstrates an end-to-end automated development workflow where
            Claude Code handles everything from issue specification to pull request reviews,
            CI validation, and deployment. Below is the technical architecture and automation
            pipeline that powers this site.
          </p>
        </section>
      </FadeIn>

      {/* Architecture Diagram */}
      <FadeIn delay={0.1}>
        <section>
          <h2 className="text-3xl font-bold mb-6 text-gray-50">Architecture</h2>

          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Frontend */}
            <div className="text-center">
              <div className="bg-gray-950 rounded-lg p-6 border border-gray-700 mb-3">
                <h3 className="text-lg font-bold text-gray-50 mb-2">Frontend</h3>
                <div className="space-y-2 text-sm text-gray-400">
                  <div>Next.js 16</div>
                  <div>React 19</div>
                  <div>TypeScript</div>
                  <div>Tailwind CSS v4</div>
                  <div>Framer Motion</div>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Server Components + Client boundaries
              </p>
            </div>

            {/* Backend */}
            <div className="text-center">
              <div className="bg-gray-950 rounded-lg p-6 border border-gray-700 mb-3">
                <h3 className="text-lg font-bold text-gray-50 mb-2">Backend</h3>
                <div className="space-y-2 text-sm text-gray-400">
                  <div>Convex</div>
                  <div>Real-time Database</div>
                  <div>Server Functions</div>
                  <div>Reactive Queries</div>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Serverless backend with real-time updates
              </p>
            </div>

            {/* Auth & Deploy */}
            <div className="text-center">
              <div className="bg-gray-950 rounded-lg p-6 border border-gray-700 mb-3">
                <h3 className="text-lg font-bold text-gray-50 mb-2">Infrastructure</h3>
                <div className="space-y-2 text-sm text-gray-400">
                  <div>WorkOS AuthKit</div>
                  <div>Vercel Hosting</div>
                  <div>GitHub Actions</div>
                  <div>Convex Deploy</div>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Admin auth + automatic deployment
              </p>
            </div>
          </div>

          <div className="text-center text-gray-500 text-sm">
            ↓
          </div>

          <div className="bg-gray-950 rounded-lg p-6 border border-gray-700 text-center">
            <div className="text-lg font-bold text-gray-50 mb-2">Result</div>
            <p className="text-gray-400">
              Fast, type-safe, real-time portfolio with automated content management
              and zero-config deployment
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-4 text-gray-400">
          <p>
            <strong className="text-gray-300">Next.js 16 App Router:</strong> Server
            Components for optimal performance, React 19 for concurrent rendering, TypeScript
            strict mode for type safety.
          </p>
          <p>
            <strong className="text-gray-300">Convex Backend:</strong> Real-time database
            with reactive queries, server functions for mutations, automatic schema validation.
          </p>
          <p>
            <strong className="text-gray-300">WorkOS AuthKit:</strong> Email allowlist for
            admin-only access, secure session management, seamless integration.
          </p>
          <p>
            <strong className="text-gray-300">Vercel + GitHub Actions:</strong> Automatic
            deployment on merge, preview deployments for PRs, integrated Convex deploy.
          </p>
        </div>
        </section>
      </FadeIn>

      {/* Automation Pipeline */}
      <FadeIn delay={0.2}>
        <section>
          <h2 className="text-3xl font-bold mb-6 text-gray-50">
            Automated Development Workflow
          </h2>

          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 space-y-6">
          <div className="space-y-4">
            {[
              { step: "1. Issue", desc: "Create GitHub issue describing feature or bug" },
              { step: "2. Claude Spec", desc: "/spec command generates mini spec with plan and acceptance criteria" },
              { step: "3. Implementation", desc: "/implement command creates branch, writes code, opens PR" },
              { step: "4. Claude Review", desc: "/review command performs structured code review, posts verdict" },
              { step: "5. CI Checks", desc: "GitHub Actions run lint, typecheck, tests, build" },
              { step: "6. Merge", desc: "If all checks pass, PR merges to main" },
              { step: "7. Deploy", desc: "Vercel auto-deploys, Convex functions update" },
              { step: "8. Changelog", desc: "Automated entry added to changelog via GitHub Actions" },
            ].map((item, i) => (
              <div key={i} className="flex items-start">
                <div className="flex-shrink-0 w-32 font-mono text-sm text-gray-500">
                  {item.step}
                </div>
                <div className="flex-1">
                  <p className="text-gray-300">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-gray-400 text-sm">
              <strong className="text-gray-300">Result:</strong> From issue to production
              in minutes, not days. Claude handles specification, implementation, and review.
              Human only approves final merge decision.
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-4 text-gray-400">
          <p>
            <strong className="text-gray-300">Claude Code Integration:</strong> Slash
            commands (/spec, /implement, /review, /release-note) automate the entire
            development lifecycle. Claude acts as spec writer, implementer, and reviewer.
          </p>
          <p>
            <strong className="text-gray-300">Required Checks:</strong> Claude review is
            a required check — PRs cannot merge without APPROVE verdict. This ensures code
            quality gates are enforced automatically.
          </p>
          <p>
            <strong className="text-gray-300">Changelog Automation:</strong> On merge to
            main, GitHub Actions generates changelog entry with PR number, commit SHA, and
            summary. Loop prevention ensures bot commits don&apos;t trigger additional updates.
          </p>
        </div>
        </section>
      </FadeIn>

      {/* Why This Matters */}
      <section className="bg-gray-900 rounded-lg p-8 border border-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-gray-50">
          Why This Matters
        </h2>
        <div className="space-y-4 text-gray-400">
          <p>
            Traditional development workflows require manual specification writing, code
            reviews, changelog updates, and deployment coordination. This creates bottlenecks
            and slows iteration speed.
          </p>
          <p>
            This automated workflow eliminates those bottlenecks. Claude Code handles the
            repetitive work, allowing focus on product decisions and architecture. Features
            ship faster, code quality remains high, and documentation stays up-to-date
            automatically.
          </p>
          <p>
            <strong className="text-gray-300">This portfolio is proof-of-concept.</strong>
            {" "}Every feature you see was built using this exact workflow. The automation
            you&apos;re reading about built the site you&apos;re reading it on.
          </p>
        </div>
      </section>

      {/* Post-v1 Note */}
      <section className="border-l-4 border-gray-800 pl-6">
        <p className="text-sm text-gray-500">
          <strong className="text-gray-400">Note:</strong> This page currently shows the
          planned workflow. Live evidence widgets (latest deployment, CI status, last Claude
          approval) will be added post-v1 once automation is fully implemented.
        </p>
      </section>
    </div>
  );
}
