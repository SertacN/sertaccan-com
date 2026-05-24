import React from "react";

export function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
    return <div className={`animate-pulse rounded bg-muted ${className ?? ""}`} style={style} />;
}

export function ProjectCardSkeleton() {
    return (
        <div className="flex flex-col border border-border bg-surface">
            <div className="h-44 w-full bg-muted animate-pulse" />
            <div className="flex flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
                <div className="flex gap-1.5">
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-5 w-14" />
                    <Skeleton className="h-5 w-10" />
                </div>
                <div className="mt-auto flex items-center gap-2 pt-2">
                    <Skeleton className="ml-auto h-7 w-16" />
                </div>
            </div>
        </div>
    );
}

export function ProjectGridSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
                <ProjectCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function ProjectDetailSkeleton() {
    return (
        <main className="mx-auto max-w-4xl py-4">
            {/* back link */}
            <Skeleton className="mb-8 h-3 w-32" />

            {/* hero image */}
            <Skeleton className="mb-8 h-64 w-full rounded" />

            {/* title + status */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
                <Skeleton className="h-8 w-56" />
                <Skeleton className="h-5 w-16" />
            </div>

            {/* tags */}
            <div className="mb-6 flex flex-wrap gap-2">
                {[72, 56, 80, 64].map((w) => (
                    <Skeleton key={w} className={`h-5 w-${w / 4}`} style={{ width: w }} />
                ))}
            </div>

            {/* buttons */}
            <div className="mb-10 flex gap-3">
                <Skeleton className="h-9 w-28" />
                <Skeleton className="h-9 w-24" />
            </div>

            {/* markdown body */}
            <div className="flex flex-col gap-3">
                <Skeleton className="h-5 w-40" />
                {[100, 90, 95, 80, 100, 70, 85, 60].map((pct, i) => (
                    <Skeleton key={i} className="h-3" style={{ width: `${pct}%` }} />
                ))}
                <Skeleton className="mt-4 h-5 w-48" />
                {[95, 88, 92, 75].map((pct, i) => (
                    <Skeleton key={i} className="h-3" style={{ width: `${pct}%` }} />
                ))}
            </div>
        </main>
    );
}
