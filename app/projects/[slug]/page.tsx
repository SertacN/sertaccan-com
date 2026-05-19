import type { Metadata } from "next";
import { getDetails } from "@/lib/server/projects";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const result = await getDetails(slug);

    if (!result.success || !result.data) {
        return { title: "Proje Bulunamadı" };
    }

    const project = result.data;
    const description = project.descriptionEn;
    const image = project.imageUrl ?? "/og-image.png";

    return {
        title: project.title,
        description,
        openGraph: {
            title: `Sertaç Can | ${project.title}`,
            description,
            type: "article",
            images: [{ url: image, width: 1200, height: 630, alt: project.title }],
        },
        twitter: {
            card: "summary_large_image",
            title: `Sertaç Can | ${project.title}`,
            description,
            images: [image],
        },
    };
}

export default async function ProjectsPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    return <div>{slug}</div>;
}
