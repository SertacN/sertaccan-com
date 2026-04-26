import ProjectCard from "@/components/ui/project-card";
import { getAllProjects } from "@/lib/server/projects";

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const { page: pageParam } = await searchParams;
    const page = Math.max(1, Number(pageParam) || 1);

    const { data } = await getAllProjects({ page, limit: 9, isActive: true });

    return (
        <main>
            <h1 className="mb-6 font-mono text-2xl font-bold text-text">Projeler</h1>
            <ProjectCard projects={data?.projects ?? []} pagination={data?.pagination} />
        </main>
    );
}
