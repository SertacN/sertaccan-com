import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getDetails } from "@/lib/server/projects";
import ProjectDetail from "@/components/projects/project-detail";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
    const { slug, locale } = await params;
    const result = await getDetails(slug);

    if (!result.success || !result.data) {
        const t = await getTranslations({ locale, namespace: "error" });
        return { title: t("not_found_title") };
    }

    const p = result.data;
    const description = locale === "en" ? p.descriptionEn : p.descriptionTr;
    const image = p.imageUrl ?? "/og-image.png";

    return {
        title: p.title,
        description,
        openGraph: {
            title: `Sertaç Can | ${p.title}`,
            description,
            type: "article",
            images: [{ url: image, width: 1200, height: 630, alt: p.title }],
        },
        twitter: {
            card: "summary_large_image",
            title: `Sertaç Can | ${p.title}`,
            description,
            images: [image],
        },
    };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    return <ProjectDetail slug={slug} />;
}
