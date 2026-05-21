import type { Metadata } from "next";
import ProjectCard from "@/components/ui/project-card";
import { getAllProjects } from "@/lib/server/projects";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "nav" });
    return { title: t("all_projects") };
}

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const { page: pageParam } = await searchParams;
    const page = Math.max(1, Number(pageParam) || 1);

    const { data } = await getAllProjects({ page, limit: 9, isActive: true });
    const t = await getTranslations("nav");

    return (
        <main>
            <h1 className="mb-6 font-mono text-2xl font-bold text-text">{t("all_projects")}</h1>
            <ProjectCard projects={data?.projects ?? []} pagination={data?.pagination} />
        </main>
    );
}
