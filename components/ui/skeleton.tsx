export function Skeleton({ className }: { className?: string }) {
    return <div className={`animate-pulse rounded bg-muted ${className ?? ""}`} />;
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
