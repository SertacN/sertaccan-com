import {
	siSvelte,
	siTypescript,
	siJavascript,
	siTailwindcss,
	siPostgresql,
	siPrisma,
	siDocker,
	siNodedotjs,
	siReact,
	siNextdotjs,
	siVuedotjs,
	siGo,
	siPython,
	siRust,
	siGit,
	siGithub,
	siGithubactions,
	siNginx,
	siRedis,
	siMongodb,
	siGraphql,
	siCloudflare,
	siLinux,
	siVercel,
	siSupabase,
	siDrizzle,
	siAngular,
	siNestjs,
	siTraefikproxy,
	siExpo,
	siHtml5,
	siCss
} from 'simple-icons';
import type { SimpleIcon } from 'simple-icons';

const ICON_MAP: Record<string, SimpleIcon> = {
	svelte: siSvelte,
	sveltekit: siSvelte,
	typescript: siTypescript,
	javascript: siJavascript,
	'tailwind css': siTailwindcss,
	tailwindcss: siTailwindcss,
	tailwind: siTailwindcss,
	postgresql: siPostgresql,
	postgres: siPostgresql,
	prisma: siPrisma,
	docker: siDocker,
	'node.js': siNodedotjs,
	nodejs: siNodedotjs,
	react: siReact,
	'next.js': siNextdotjs,
	nextjs: siNextdotjs,
	'vue.js': siVuedotjs,
	vuejs: siVuedotjs,
	vue: siVuedotjs,
	go: siGo,
	golang: siGo,
	python: siPython,
	rust: siRust,
	git: siGit,
	github: siGithub,
	nginx: siNginx,
	redis: siRedis,
	mongodb: siMongodb,
	graphql: siGraphql,
	cloudflare: siCloudflare,
	linux: siLinux,
	vercel: siVercel,
	supabase: siSupabase,
	drizzle: siDrizzle,
	angular: siAngular,
	nestjs: siNestjs,
	'github actions': siGithubactions,
	traefik: siTraefikproxy,
	'react native expo': siExpo,
	expo: siExpo,
	'react native': siReact,
	'html/css': siHtml5,
	html: siHtml5,
	css: siCss
};

// Override colors that are too dark for dark backgrounds
const DARK_COLOR_OVERRIDES: Record<string, string> = {
	angular: 'DD0031', // Angular's classic red
	expo: 'FFFFFF',
	'github actions': 'FFFFFF',
	github: 'FFFFFF',
	'next.js': 'FFFFFF',
	nextjs: 'FFFFFF',
	vercel: 'FFFFFF'
};

export function getTechIcon(name: string): SimpleIcon | null {
	const key = name.toLowerCase();
	const icon = ICON_MAP[key];
	if (!icon) return null;

	const override = DARK_COLOR_OVERRIDES[key];
	if (override) {
		return { ...icon, hex: override };
	}
	return icon;
}
