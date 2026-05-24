import { getAllProjects } from "@/lib/server/projects";
import ProjectCard from "@/components/ui/project-card";
import { getTranslations } from "next-intl/server";

export default async function ProjectList({ page }: { page: number }) {
    const [{ data }, t] = await Promise.all([
        getAllProjects({ page, limit: 9, isActive: true }),
        getTranslations("nav"),
    ]);

    return (
        <main>
            <h1 className="mb-6 font-mono text-2xl font-bold text-text">{t("all_projects")}</h1>
            <ProjectCard projects={data?.projects ?? []} pagination={data?.pagination} />
        </main>
    );
}
