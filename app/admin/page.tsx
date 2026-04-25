import { getAllProjects } from "@/lib/server/projects";
import ProjectForm from "@/components/admin/project-form";
import ProjectList from "@/components/admin/project-list";

export default async function AdminPage() {
    const projects = await getAllProjects();

    return (
        <div className="flex flex-col gap-8">
            <h1 className="font-mono text-2xl font-bold text-primary">Admin Panel</h1>
            <ProjectForm />
            <ProjectList projects={projects} />
        </div>
    );
}
