import { project } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link as LocaleLink } from "@/i18n/navigation";
import Github from "../icons/github";
import Link from "next/link";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "./pagination";
import buildPages from "@/utils/build-pages";
import StoreButtons from "./store-buttons";
import { STATUS_ICONS } from "@/components/pixel/icons";

export type Project = InferSelectModel<typeof project>;
type PaginationData = { page: number; totalPages: number };

// Quest-style status badge colors; labels come from the "project_status" messages.
const statusClass: Record<Project["status"], string> = {
    ACTIVE: "text-primary [--frame:var(--primary)]",
    WIP: "text-warn [--frame:var(--warn)]",
    ARCHIVED: "text-muted-foreground [--frame:var(--muted-foreground)]",
};

export const framedButton =
    "frame-2 m-0.5 flex h-8 items-center gap-2 bg-card px-2.5 font-mono text-xs font-bold text-foreground hover:bg-btn-hover hover:text-foreground";

export default async function ProjectCard({
    projects,
    pagination,
}: {
    projects: Project[];
    pagination?: PaginationData;
}) {
    const pages = pagination ? buildPages(pagination.page, pagination.totalPages) : [];
    return (
        <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                    <ProjectCardItem key={project.slug} project={project} />
                ))}
            </div>
            {/*PAGINATION*/}
            {pagination && pagination.totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href={`?page=${pagination.page - 1}`}
                                aria-disabled={pagination.page <= 1}
                                className={pagination.page <= 1 ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>

                        {pages.map((p, i) =>
                            p === "ellipsis" ? (
                                <PaginationItem key={`ellipsis-${i}`}>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            ) : (
                                <PaginationItem key={p}>
                                    <PaginationLink href={`?page=${p}`} isActive={p === pagination.page}>
                                        {p}
                                    </PaginationLink>
                                </PaginationItem>
                            ),
                        )}

                        <PaginationItem>
                            <PaginationNext
                                href={`?page=${pagination.page + 1}`}
                                aria-disabled={pagination.page >= pagination.totalPages}
                                className={
                                    pagination.page >= pagination.totalPages ? "pointer-events-none opacity-50" : ""
                                }
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}

export async function ProjectCardItem({ project, eagerImage = true }: { project: Project; eagerImage?: boolean }) {
    const locale = await getLocale();
    const currentLang = locale === "en" ? "en" : "tr";
    const [t, ts] = await Promise.all([getTranslations("home_projects"), getTranslations("project_status")]);
    const displayTitle = currentLang === "en" && project.titleEn ? project.titleEn : project.title;
    const StatusIcon = STATUS_ICONS[project.status];

    return (
        <article className="frame-4 m-1 flex h-full flex-col bg-card [--frame:var(--pixel-line)] hover:[--frame:var(--primary)]">
            {/* Mouse-only shortcut; the "details" link below is the accessible link to the same page. */}
            <LocaleLink
                href={`/projects/${project.slug}`}
                tabIndex={-1}
                aria-hidden="true"
                className="relative block aspect-video border-b-4 border-pixel-line bg-card"
            >
                {project.imageUrl ? (
                    <Image
                        loading={eagerImage ? "eager" : "lazy"}
                        sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 90vw"
                        className="object-cover"
                        src={project.imageUrl}
                        alt=""
                        fill
                    />
                ) : (
                    <span
                        className="flex size-full items-center justify-center bg-size-[8px_8px]"
                        style={{
                            backgroundImage: "repeating-conic-gradient(var(--pixel-line) 0 25%, transparent 0 50%)",
                        }}
                    >
                        <span className="bg-card px-2 py-1 font-mono text-xs text-muted-foreground">
                            {t("image_placeholder")}
                        </span>
                    </span>
                )}
            </LocaleLink>

            <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex">
                    <span
                        className={`frame-2 m-0.5 flex h-6.5 items-center gap-1.5 bg-background px-2 font-mono text-xs font-bold tracking-[0.06em] uppercase ${statusClass[project.status]}`}
                    >
                        <StatusIcon />
                        <span>{ts(project.status)}</span>
                    </span>
                </div>
                {/* Title and description are clamped and keep their full height even when short, so every
                    card in a row lines up; the full text stays in the DOM and on the detail page. */}
                <h3 className="m-0 line-clamp-2 min-h-[2lh] font-sans text-lg leading-[1.35] font-semibold text-pretty text-foreground">
                    {displayTitle}
                </h3>
                <p className="m-0 line-clamp-3 min-h-[3lh] text-sm leading-[1.6] text-pretty text-muted-foreground">
                    {currentLang === "tr" ? project.descriptionTr : project.descriptionEn}
                </p>
                {project.tags.length > 0 && (
                    <ul className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                            <li
                                key={tag}
                                className="border border-pixel-line px-1.5 py-0.5 font-mono text-xs text-muted-foreground"
                            >
                                {tag}
                            </li>
                        ))}
                    </ul>
                )}
                <div className="mt-auto flex flex-wrap items-center gap-2.5 pt-2">
                    {project.githubUrl && (
                        <Link
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`GitHub: ${displayTitle}`}
                            className={framedButton}
                        >
                            <Github size={16} />
                            <span aria-hidden="true">GitHub</span>
                        </Link>
                    )}
                    <StoreButtons
                        appStoreUrl={project.appStoreUrl}
                        googlePlayUrl={project.googlePlayUrl}
                        projectName={displayTitle}
                    />
                    <LocaleLink
                        href={`/projects/${project.slug}`}
                        className="ml-auto font-mono text-[13px] font-bold text-primary hover:text-foreground"
                    >
                        {t("details")}
                        <span className="sr-only"> {displayTitle}</span>
                    </LocaleLink>
                </div>
            </div>
        </article>
    );
}
