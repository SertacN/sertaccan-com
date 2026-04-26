"use client";

import { useState, useEffect, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { getTechIcon } from "@/utils/tech-icon";

const TAGS = [
    "sveltekit",
    "typescript",
    "javascript",
    "tailwindcss",
    "postgresql",
    "prisma",
    "docker",
    "nextjs",
    "redis",
    "nginx",
    "drizzle",
    "angular",
    "nestjs",
    "traefik",
    "github actions",
    "expo",
];

export default function TagSelector({ error, defaultValue }: { error?: string; defaultValue?: string[] }) {
    const [selected, setSelected] = useState<string[]>(defaultValue ?? []);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const form = containerRef.current?.closest("form");
        if (!form) return;
        const handleReset = () => setSelected([]);
        form.addEventListener("reset", handleReset);
        return () => form.removeEventListener("reset", handleReset);
    }, []);

    function toggle(tag: string) {
        setSelected((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
    }

    return (
        <div ref={containerRef}>
            <input type="hidden" name="tags" value={selected.join(",")} />
            <div className="grid grid-cols-2 gap-1 rounded border border-input bg-background p-3 sm:grid-cols-3 md:grid-cols-4">
                {TAGS.map((tag) => {
                    const icon = getTechIcon(tag);
                    return (
                        <label
                            key={tag}
                            className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-muted"
                        >
                            <Checkbox checked={selected.includes(tag)} onCheckedChange={() => toggle(tag)} />
                            {icon && (
                                <svg viewBox="0 0 24 24" width="12" height="12" fill={`#${icon.hex}`} aria-hidden>
                                    <path d={icon.path} />
                                </svg>
                            )}
                            <span className="font-mono text-xs text-muted-foreground">{tag}</span>
                        </label>
                    );
                })}
            </div>
            {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
        </div>
    );
}
