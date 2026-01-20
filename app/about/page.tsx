export const metadata = {
  title: "About | Saad Siddiqui",
  description: "Background, approach, and strengths in full-stack development and automation",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-16 pb-16">
      <section>
        <h1 className="text-4xl font-bold mb-8 text-gray-50">About</h1>

        <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
          <p>
            I'm a full-stack engineer who believes the best code is code that ships fast,
            scales confidently, and maintains itself. My approach combines modern web
            technologies with AI-assisted development workflows to deliver production-ready
            applications faster than traditional methods.
          </p>

          <p>
            This portfolio itself is a demonstration of that philosophy. Built with Next.js,
            TypeScript, Convex, and WorkOS, it showcases an end-to-end automated workflow
            where Claude Code handles everything from issue specification to pull request
            reviews, CI validation, and deployment.
          </p>

          <p>
            My background spans startup environments and product-focused teams where shipping
            quickly and iterating based on real user feedback is essential. I specialize in
            translating ambiguous requirements into working software, establishing development
            workflows that enable teams to move faster, and building systems that scale without
            constant maintenance.
          </p>

          <p>
            When I'm not coding, I'm exploring new tools in the AI-assisted development space,
            contributing to open source projects, and documenting patterns that help other
            engineers ship faster.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-8 text-gray-50">Core Strengths</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-100">
              Full-Stack Development
            </h3>
            <p className="text-gray-400">
              Modern web stack with Next.js, TypeScript, React, and serverless backends.
              Building responsive interfaces and scalable APIs with performance and
              maintainability in mind.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-100">
              AI-Assisted Workflows
            </h3>
            <p className="text-gray-400">
              Integrating Claude Code and GitHub Actions to automate development workflows.
              Reducing time from idea to production through intelligent automation and
              continuous deployment.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-100">
              System Design & Architecture
            </h3>
            <p className="text-gray-400">
              Designing systems that grow with product needs. Making architectural decisions
              that balance simplicity, scalability, and developer experience.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-100">
              Rapid Prototyping
            </h3>
            <p className="text-gray-400">
              Building MVPs and proof-of-concepts quickly to validate ideas. Using modern
              tools and frameworks to deliver working software in days, not months.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-900 rounded-lg p-8 border border-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-gray-50">
          Working with Engineering Managers
        </h2>
        <p className="text-gray-400 leading-relaxed">
          I work best with engineering managers who value velocity, quality, and automation.
          If you're looking for someone who can ship features quickly while maintaining high
          standards, establish development workflows that scale, and bring AI-assisted
          development practices to your team, let's talk.
        </p>
      </section>
    </div>
  );
}
