import { MetadataRoute } from "next";
import { db } from "@/db";
import { project } from "@/db/schema";
import { eq, and } from "drizzle-orm";

const BASE_URL = "https://sertaccan.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const projects = await db
        .select({ slug: project.slug, updatedAt: project.updatedAt })
        .from(project)
        .where(and(eq(project.isDeleted, false), eq(project.isActive, true)));

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            alternates: {
                languages: {
                    tr: BASE_URL,
                    en: `${BASE_URL}/en`,
                },
            },
        },
    ];

    const projectPages: MetadataRoute.Sitemap = projects.map((p) => ({
        url: `${BASE_URL}/projects/${p.slug}`,
        lastModified: p.updatedAt,
        alternates: {
            languages: {
                tr: `${BASE_URL}/projects/${p.slug}`,
                en: `${BASE_URL}/en/projects/${p.slug}`,
            },
        },
    }));

    return [...staticPages, ...projectPages];
}
