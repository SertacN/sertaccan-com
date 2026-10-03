import type { TechIcon as TechIconData } from "@/utils/custom-tech-icons";

// Black or white brand marks follow the text color so they stay visible in both themes.
const MONOCHROME = new Set(["nextjs", "expressjs", "drizzle", "prisma", "expo", "react native expo"]);

export default function TechIcon({ icon, name, size }: { icon: TechIconData | null; name: string; size: number }) {
    if (!icon) return null;
    const mono = MONOCHROME.has(name.toLowerCase()) || icon.hex.toUpperCase() === "FFFFFF";
    return (
        <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill={mono ? "currentColor" : `#${icon.hex}`}
            aria-hidden="true"
            className="shrink-0 text-foreground"
        >
            <path d={icon.path} />
        </svg>
    );
}
