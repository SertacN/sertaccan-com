import {
    siSvelte,
    siTypescript,
    siJavascript,
    siTailwindcss,
    siPostgresql,
    siPrisma,
    siDocker,
    siNextdotjs,
    siGithubactions,
    siNginx,
    siRedis,
    siDrizzle,
    siAngular,
    siNestjs,
    siTraefikproxy,
    siExpo,
} from "simple-icons";
import type { SimpleIcon } from "simple-icons";

const ICON_MAP: Record<string, SimpleIcon> = {
    sveltekit: siSvelte,
    typescript: siTypescript,
    javascript: siJavascript,
    tailwindcss: siTailwindcss,
    postgresql: siPostgresql,
    prisma: siPrisma,
    docker: siDocker,
    nextjs: siNextdotjs,
    redis: siRedis,
    nginx: siNginx,
    drizzle: siDrizzle,
    angular: siAngular,
    nestjs: siNestjs,
    traefik: siTraefikproxy,
    "github actions": siGithubactions,
    expo: siExpo,
};

const DARK_COLOR_OVERRIDES: Record<string, string> = {
    angular: "DD0031",
    expo: "FFFFFF",
    "github actions": "FFFFFF",
    nextjs: "FFFFFF",
};

export function getTechIcon(name: string): SimpleIcon | null {
    const key = name.toLowerCase();
    const icon = ICON_MAP[key];
    if (!icon) return null;

    const override = DARK_COLOR_OVERRIDES[key];
    if (override) return { ...icon, hex: override };
    return icon;
}
