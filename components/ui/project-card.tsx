import { project } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import Image from "next/image";
import { getLocale } from "next-intl/server";
import { Button } from "./button";
import Github from "../icons/github";
import Link from "next/link";
import { getTechIcon } from "@/utils/tech-icon";
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

type Project = InferSelectModel<typeof project>;
type PaginationData = { page: number; totalPages: number };

const statusConfig: Record<Project["status"], { label: string; className: string }> = {
    ACTIVE: { label: "Active", className: "border-primary text-primary" },
    WIP: { label: "WIP", className: "border-yellow-500 text-yellow-500" },
    ARCHIVED: { label: "Archived", className: "border-muted-foreground text-muted-foreground" },
};

export default async function ProjectCard({ projects, pagination }: { projects: Project[]; pagination?: PaginationData }) {
    const locale = await getLocale();
    const currentLang = locale === "en" ? "en" : "tr";
    const pages = pagination ? buildPages(pagination.page, pagination.totalPages) : [];
    return (
        <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => {
                    const { label, className } = statusConfig[project.status];
                    return (
                        <div className="flex flex-col border border-border bg-surface" key={project.slug}>
                            {/*IMAGE*/}
                            <Link aria-label="Project Details" href={`projects/${project.slug}`}>
                                {project.imageUrl ? (
                                    <div className="relative h-44 w-full rounded-t overflow-hidden">
                                        <Image
                                            loading="eager"
                                            sizes="2xl"
                                            className="object-cover"
                                            src={project.imageUrl}
                                            alt={project.title}
                                            fill
                                        ></Image>
                                    </div>
                                ) : (
                                    <div className="h-44 w-full rounded-t bg-muted" />
                                )}
                            </Link>

                            {/*TITLE + STATUS*/}
                            <div className="flex flex-1 flex-col gap-3 p-5">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="font-mono text-sm font-bold text-text">{project.title}</h3>
                                    <span
                                        className={`shrink-0 rounded border px-1.5 py-0.5 font-mono text-xs ${className}`}
                                    >
                                        {label}
                                    </span>
                                </div>
                                {/*DESCRIPTION*/}
                                <p className="text-xs leading-relaxed text-muted-foreground">
                                    {currentLang === "tr" ? project.descriptionTr : project.descriptionEn}
                                </p>
                                {/*TAG*/}
                                {project.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {project.tags.map((tag) => {
                                            const icon = getTechIcon(tag);
                                            return (
                                                <span
                                                    className="flex items-center gap-1 rounded border border-border px-1.5 py-0.5 font-mono text-xs text-muted-foreground capitalize"
                                                    key={tag}
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
                                {/*LINKS*/}
                                <div className="mt-auto flex items-center gap-2 pt-2">
                                    {project.githubUrl && (
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className="cursor-pointer"
                                            aria-label="Github Link"
                                            asChild
                                        >
                                            <Link href={project.githubUrl} aria-label="Github Link" target="_blank">
                                                <Github size={14} />
                                            </Link>
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="ml-auto cursor-pointer text-primary hover:text-primary"
                                        aria-label="Project Details"
                                        asChild
                                    >
                                        <Link href={`projects/${project.slug}`}>Detay →</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}
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
