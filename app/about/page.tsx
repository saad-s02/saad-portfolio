import { FadeIn } from "@/components/animations/FadeIn";
import { SlideIn } from "@/components/animations/SlideIn";

export const metadata = {
  title: "About",
  description: "Background, approach, and strengths in full-stack development and AI-assisted automation workflows. Building modern web applications that ship faster.",
  openGraph: {
    title: "About",
    description: "Background, approach, and strengths in full-stack development and AI-assisted automation workflows.",
    type: 'website',
    url: 'https://saadsiddiqui.dev/about',
  },
  alternates: {
    canonical: 'https://saadsiddiqui.dev/about',
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-16 pb-16">
      <FadeIn>
        <section>
          <h1 className="text-4xl font-bold mb-8 text-gray-50">About</h1>

          <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
            <p>
              I&apos;m a full-stack software engineer building AI-powered applications and scalable
              production systems. Currently at Tetra Tech, I lead development of AI-enabled tools
              for document extraction, data validation, and workflow automation using Azure OpenAI
              and Document Intelligence.
            </p>

            <p>
              My work spans the full software development lifecycle—from designing LLM pipelines
              with structure-aware chunking to building enterprise-grade applications with C#/.NET,
              React, and Python. I&apos;ve shipped systems that process large volumes of unstructured
              technical documents into structured datasets for analytics and operational use.
            </p>

            <p>
              This portfolio demonstrates my approach to development: automated workflows with
              Claude Code, continuous deployment, and AI-assisted review gates. Built with Next.js,
              TypeScript, Convex, and WorkOS.
            </p>
          </div>
        </section>
      </FadeIn>

      <section>
        <FadeIn delay={0.1}>
          <h2 className="text-3xl font-bold mb-8 text-gray-50">Core Strengths</h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SlideIn direction="left" delay={0}>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-100">
                Full-Stack Development
              </h3>
              <p className="text-gray-400">
                Enterprise applications with C#/.NET, React, Next.js, and Python. Building
                backend services, APIs, and user-facing tooling with CI/CD pipelines in
                Azure DevOps.
              </p>
            </div>
          </SlideIn>

          <SlideIn direction="left" delay={0.1}>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-100">
                AI Engineering
              </h3>
              <p className="text-gray-400">
                LLM-powered applications, RAG pipelines, and document intelligence. Improving
                retrieval accuracy through structure-aware chunking and building reliable
                high-throughput automation.
              </p>
            </div>
          </SlideIn>

          <SlideIn direction="left" delay={0.2}>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-100">
                System Design & Architecture
              </h3>
              <p className="text-gray-400">
                Scalable data-processing pipelines, validation workflows, and reconciliation
                systems. Designing for reliability with rate limiting, retries, and monitoring.
              </p>
            </div>
          </SlideIn>

          <SlideIn direction="left" delay={0.3}>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-100">
                AI-Assisted Workflows
              </h3>
              <p className="text-gray-400">
                Integrating Claude Code into development workflows. Automating from issue
                specification to PR review, CI validation, and deployment.
              </p>
            </div>
          </SlideIn>
        </div>
      </section>

      <FadeIn delay={0.2}>
        <section className="bg-gray-900 rounded-lg p-8 border border-gray-800">
          <h2 className="text-2xl font-bold mb-4 text-gray-50">
            Let&apos;s Connect
          </h2>
          <p className="text-gray-400 leading-relaxed">
            I work best on teams tackling complex technical problems where reliability and
            scalability matter. If you&apos;re building AI-powered applications, enterprise tooling,
            or looking for someone who can own features end-to-end while mentoring others,
            let&apos;s connect.
          </p>
        </section>
      </FadeIn>
    </div>
  );
}
