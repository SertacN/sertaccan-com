import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ProjectList from "@/components/projects/project-list";

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
    return <ProjectList page={page} />;
}
