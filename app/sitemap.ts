import type { MetadataRoute } from "next";
import { db } from "@/db";
import { project } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

const BASE_URL = "https://sertaccan.com";

const CONTENT_REVISION = new Date("2026-08-03T23:56:15+03:00");

const latest = (dates: Date[]) => dates.reduce((newest, d) => (d > newest ? d : newest), CONTENT_REVISION);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const projects = await db
        .select({ slug: project.slug, updatedAt: project.updatedAt })
        .from(project)
        .where(and(eq(project.isDeleted, false), eq(project.isActive, true)));

    const projectsUpdatedAt = latest(projects.map((p) => p.updatedAt));

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: projectsUpdatedAt,
            changeFrequency: "monthly",
            priority: 1,
        },
        {
            url: `${BASE_URL}/en`,
            lastModified: projectsUpdatedAt,
            changeFrequency: "monthly",
            priority: 1,
        },
        {
            url: `${BASE_URL}/projects`,
            lastModified: projectsUpdatedAt,
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/en/projects`,
            lastModified: projectsUpdatedAt,
            changeFrequency: "weekly",
            priority: 0.8,
        },
    ];

    const projectPages: MetadataRoute.Sitemap = projects.flatMap((p) => [
        {
            url: `${BASE_URL}/projects/${p.slug}`,
            lastModified: p.updatedAt,
            changeFrequency: "monthly" as const,
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/en/projects/${p.slug}`,
            lastModified: p.updatedAt,
            changeFrequency: "monthly" as const,
            priority: 0.7,
        },
    ]);

    return [...staticPages, ...projectPages];
}
