import type { Metadata } from "next";
import ProjectCard from "@/components/ui/project-card";
import { getAllProjects } from "@/lib/server/projects";

export const metadata: Metadata = {
    title: "Projeler",
    description: "Geliştirdiğim projeleri inceleyin.",
    openGraph: {
        title: "Sertaç Can | Projeler",
        description: "Geliştirdiğim projeleri inceleyin.",
        type: "website",
        images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Sertaç Can | Projeler",
        description: "Geliştirdiğim projeleri inceleyin.",
        images: ["/og-image.png"],
    },
};

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
