import { getAllProjects } from "@/lib/server/projects";

export default async function ProjectsPage() {
    const { data } = await getAllProjects();

    return (
        <main>
            <h1 className="mb-2 font-mono text-2xl font-bold text-text">Projeler</h1>
        </main>
    );
}
