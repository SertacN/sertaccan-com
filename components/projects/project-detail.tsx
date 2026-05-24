import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { getLocale, getTranslations } from "next-intl/server";
import { getDetails } from "@/lib/server/projects";
import { getTechIcon } from "@/utils/tech-icon";
import { notFound } from "next/navigation";

const statusConfig = {
    ACTIVE: { key: "status_active" as const, className: "border-primary text-primary" },
    WIP: { key: "status_wip" as const, className: "border-yellow-500 text-yellow-500" },
    ARCHIVED: { key: "status_archived" as const, className: "border-muted-foreground text-muted-foreground" },
};

export default async function ProjectDetail({ slug }: { slug: string }) {
    const [result, locale, t] = await Promise.all([
        getDetails(slug),
        getLocale(),
        getTranslations("project_detail"),
    ]);

    if (!result.success || !result.data) notFound();

    const p = result.data;
    const longDescription = locale === "en" ? p.longDescriptionEn : p.longDescriptionTr;
    const { key: statusKey, className: statusClassName } = statusConfig[p.status];

    return (
        <main className="mx-auto max-w-4xl py-4">
            <Link
                href={`/${locale}/projects`}
                className="mb-8 inline-block font-mono text-xs text-muted-foreground transition-colors duration-150 hover:text-text"
            >
                {t("back")}
            </Link>

            {p.imageUrl ? (
                <div className="relative mb-8 h-64 w-full overflow-hidden rounded border border-border">
                    <Image
                        src={p.imageUrl}
                        alt={p.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 896px) 100vw, 896px"
                    />
                </div>
            ) : (
                <div className="mb-8 h-64 w-full rounded border border-border bg-surface" />
            )}

            <div className="mb-4 flex flex-wrap items-center gap-3">
                <h1 className="font-mono text-3xl font-bold text-text">{p.title}</h1>
                <span className={`rounded border px-2 py-0.5 font-mono text-xs ${statusClassName}`}>
                    {t(statusKey)}
                </span>
            </div>

            {p.tags.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                    {p.tags.map((tag) => {
                        const icon = getTechIcon(tag);
                        return (
                            <span
                                key={tag}
                                className="flex items-center gap-1 rounded border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground capitalize"
                            >
                                {icon && (
                                    <svg
                                        role="img"
                                        viewBox="0 0 24 24"
                                        width="10"
                                        height="10"
                                        fill={`#${icon.hex}`}
                                        aria-label={icon.title}
                                    >
                                        <path d={icon.path} />
                                    </svg>
                                )}
                                {tag}
                            </span>
                        );
                    })}
                </div>
            )}

            <div className="mb-10 flex flex-wrap gap-3">
                {p.githubUrl && (
                    <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded border border-border px-4 py-2 font-mono text-sm text-muted-foreground transition-colors duration-150 hover:border-text hover:text-text"
                    >
                        {t("github")}
                    </a>
                )}
                {p.liveUrl && (
                    <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded border border-primary px-4 py-2 font-mono text-sm text-primary transition-colors duration-150 hover:bg-primary/10"
                    >
                        {t("live_site")}
                    </a>
                )}
            </div>

            {longDescription && (
                <article className="prose prose-invert dark:prose-invert max-w-none prose-headings:font-mono prose-headings:text-text prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-text prose-code:text-accent-foreground prose-pre:border prose-pre:border-border prose-pre:bg-surface prose-th:text-text prose-td:text-muted-foreground">
                    <ReactMarkdown>{longDescription}</ReactMarkdown>
                </article>
            )}
        </main>
    );
}
