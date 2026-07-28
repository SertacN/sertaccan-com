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
    siHtml5,
    siExpress,
    siPython,
    siRabbitmq,
} from "simple-icons";
import { bullmqIcon, type TechIcon } from "./custom-tech-icons";

const ICON_MAP: Record<string, TechIcon> = {
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
    "react native expo": siExpo,
    "html/css": siHtml5,
    expressjs: siExpress,
    python: siPython,
    rabbitmq: siRabbitmq,
    bullmq: bullmqIcon,
};

const DARK_COLOR_OVERRIDES: Record<string, string> = {
    angular: "DD0031",
    expo: "FFFFFF",
    "github actions": "FFFFFF",
    nextjs: "FFFFFF",
    expressjs: "FFFFFF",
};

export function getTechIcon(name: string): TechIcon | null {
    const key = name.toLowerCase();
    const icon = ICON_MAP[key];
    if (!icon) return null;

    const override = DARK_COLOR_OVERRIDES[key];
    if (override) return { ...icon, hex: override };
    return icon;
}
