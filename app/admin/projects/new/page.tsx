import { ProjectForm } from "./ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-100 mb-6">Create New Project</h1>
      <ProjectForm />
    </div>
  );
}
