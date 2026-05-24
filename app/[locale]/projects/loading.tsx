import { ProjectGridSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <main>
            <div className="mb-6 h-8 w-40 animate-pulse rounded bg-muted" />
            <ProjectGridSkeleton count={3} />
        </main>
    );
}
