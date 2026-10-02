import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getDetails } from "@/lib/server/projects";
import ProjectDetail from "@/components/projects/project-detail";
import type { project } from "@/db/schema";

type Project = typeof project.$inferSelect;

const BASE_URL = "https://sertaccan.com";

const getKeywords = (p: Project, locale: string) => [
    ...new Set([...(locale === "en" ? p.keywordsEn : p.keywordsTr), ...p.tags]),
];

const absoluteUrl = (path: string) => new URL(path, BASE_URL).toString();

// Mobile store links take precedence, then a live URL; otherwise it is plain source code.
function getSchemaType(p: Project) {
    if (p.appStoreUrl || p.googlePlayUrl) return "MobileApplication";
    if (p.liveUrl) return "WebApplication";
    return "SoftwareSourceCode";
}

function buildJsonLd(p: Project, locale: string, projectsLabel: string) {
    const localePrefix = locale === "en" ? "/en" : "";
    const pageUrl = `${BASE_URL}${localePrefix}/projects/${p.slug}`;
    const name = locale === "en" && p.titleEn ? p.titleEn : p.title;
    const type = getSchemaType(p);
    const sameAs = [...new Set([p.githubUrl, p.liveUrl, p.appStoreUrl, p.googlePlayUrl].filter(Boolean))];

    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": type,
                "@id": `${pageUrl}#project`,
                name,
                description: locale === "en" ? p.descriptionEn : p.descriptionTr,
                url: pageUrl,
                inLanguage: locale,
                ...(p.imageUrl && { image: absoluteUrl(p.imageUrl) }),
                keywords: getKeywords(p, locale).join(", "),
                author: { "@type": "Person", name: "Sertaç Can", url: BASE_URL },
                dateCreated: p.createdAt.toISOString(),
                dateModified: p.updatedAt.toISOString(),
                ...(type === "SoftwareSourceCode" && p.githubUrl && { codeRepository: p.githubUrl }),
                ...(type === "MobileApplication" && {
                    operatingSystem: [p.appStoreUrl && "iOS", p.googlePlayUrl && "Android"]
                        .filter(Boolean)
                        .join(", "),
                }),
                ...(sameAs.length > 0 && { sameAs }),
            },
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Sertaç Can", item: `${BASE_URL}${localePrefix}` },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: projectsLabel,
                        item: `${BASE_URL}${localePrefix}/projects`,
                    },
                    { "@type": "ListItem", position: 3, name, item: pageUrl },
                ],
            },
        ],
    };
}

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
    const displayTitle = locale === "en" && p.titleEn ? p.titleEn : p.title;
    const keywords = getKeywords(p, locale);

    return {
        title: displayTitle,
        description,
        keywords,
        openGraph: {
            title: `Sertaç Can | ${displayTitle}`,
            description,
            type: "article",
            images: [{ url: image, width: 1200, height: 630, alt: displayTitle }],
        },
        twitter: {
            card: "summary_large_image",
            title: `Sertaç Can | ${displayTitle}`,
            description,
            images: [image],
        },
    };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
    const { slug, locale } = await params;
    const [result, t] = await Promise.all([getDetails(slug), getTranslations({ locale, namespace: "nav" })]);

    return (
        <>
            {result.success && result.data && (
                <script
                    type="application/ld+json"
                    // Escape "<" so user-provided content cannot close the script tag.
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(buildJsonLd(result.data, locale, t("projects"))).replace(
                            /</g,
                            "\\u003c",
                        ),
                    }}
                />
            )}
            <ProjectDetail slug={slug} />
        </>
    );
}
