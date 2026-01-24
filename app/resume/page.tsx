import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { FadeIn } from "@/components/animations/FadeIn";

export const metadata = {
  title: "Resume",
  description: "Professional experience, technical skills, education, and career highlights in full-stack development and automation engineering.",
  openGraph: {
    title: "Resume",
    description: "Professional experience, technical skills, education, and career highlights in full-stack development.",
    type: 'website',
    url: 'https://yourdomain.com/resume',
  },
  alternates: {
    canonical: 'https://yourdomain.com/resume',
  },
};

export default async function ResumePage() {
  const resume = await fetchQuery(api.resume.get);

  // Handle case where resume data doesn't exist yet (will be added via admin panel)
  if (!resume) {
    return (
      <div className="max-w-4xl mx-auto py-16">
        <h1 className="text-4xl font-bold mb-8 text-gray-50">Resume</h1>
        <FadeIn>
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
            <p className="text-gray-400">
              Resume data not available yet. Content will be added via admin panel.
            </p>
          </div>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-16">
      <h1 className="text-4xl font-bold mb-8 text-gray-50">Resume</h1>

      {/* Highlights Section */}
      {resume.highlights.length > 0 && (
        <FadeIn>
          <section>
            <h2 className="text-2xl font-bold mb-6 text-gray-50">Highlights</h2>
            <ul className="space-y-3">
              {resume.highlights.map((highlight, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-gray-500 mr-3 mt-1">→</span>
                  <span className="text-gray-300 text-lg">{highlight}</span>
                </li>
              ))}
            </ul>
          </section>
        </FadeIn>
      )}

      {/* Experience Section */}
      {resume.experience.length > 0 && (
        <FadeIn delay={0.1}>
          <section>
            <h2 className="text-2xl font-bold mb-6 text-gray-50">Experience</h2>
            <div className="space-y-8">
              {resume.experience.map((exp, i) => (
                <div key={i} className="border-l-2 border-gray-800 pl-6">
                  <h3 className="text-xl font-semibold text-gray-50">{exp.role}</h3>
                  <div className="text-gray-400 mb-2">
                    {exp.company} • {exp.period}
                  </div>
                  <p className="text-gray-400 mb-4">{exp.description}</p>
                  {exp.achievements.length > 0 && (
                    <ul className="space-y-2">
                      {exp.achievements.map((achievement, j) => (
                        <li key={j} className="flex items-start">
                          <span className="text-gray-600 mr-2">•</span>
                          <span className="text-gray-400">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        </FadeIn>
      )}

      {/* Education Section */}
      {resume.education.length > 0 && (
        <FadeIn delay={0.2}>
          <section>
            <h2 className="text-2xl font-bold mb-6 text-gray-50">Education</h2>
            <div className="space-y-4">
              {resume.education.map((edu, i) => (
                <div key={i}>
                  <h3 className="text-lg font-semibold text-gray-50">{edu.degree}</h3>
                  <div className="text-gray-400">
                    {edu.institution} • {edu.year}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>
      )}

      {/* Skills Section */}
      {resume.skills.length > 0 && (
        <FadeIn delay={0.3}>
          <section>
            <h2 className="text-2xl font-bold mb-6 text-gray-50">Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {resume.skills.map((skillGroup, i) => (
                <div key={i}>
                  <h3 className="font-semibold mb-3 text-gray-100">
                    {skillGroup.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-gray-900 border border-gray-800
                                   rounded text-sm text-gray-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>
      )}
    </div>
  );
}
