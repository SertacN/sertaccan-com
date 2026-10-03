import { db } from "@/db";
import { project } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { techstack } from "@/lib/tech-stack";

// Served at /llms.txt (https://llmstxt.org): a Markdown overview of the site for AI assistants.
// Built per request so new projects from the admin panel show up without a redeploy.
export const dynamic = "force-dynamic";

const BASE_URL = "https://sertaccan.com";

// Keep each project line short; the full text lives on the project page.
const MAX_DESCRIPTION = 200;

const oneLine = (text: string) => {
    const flat = text.replace(/\s+/g, " ").trim();
    return flat.length > MAX_DESCRIPTION ? `${flat.slice(0, MAX_DESCRIPTION - 1).trimEnd()}…` : flat;
};

export async function GET() {
    const projects = await db
        .select({
            slug: project.slug,
            title: project.title,
            titleEn: project.titleEn,
            descriptionEn: project.descriptionEn,
            tags: project.tags,
        })
        .from(project)
        .where(and(eq(project.isDeleted, false), eq(project.isActive, true)))
        .orderBy(desc(project.order), desc(project.createdAt));

    const stack = Object.entries(Object.groupBy(techstack, (t) => t.category))
        .map(([category, items]) => `- ${category}: ${items!.map((t) => t.name).join(", ")}`)
        .join("\n");

    const projectLines = projects
        .map((p) => {
            const tags = p.tags.length ? ` (${p.tags.join(", ")})` : "";
            return `- [${p.titleEn || p.title}](${BASE_URL}/en/projects/${p.slug}): ${oneLine(p.descriptionEn)}${tags}`;
        })
        .join("\n");

    const body = `# Sertaç Can

> Full-stack software developer based in Istanbul, Turkey. This is his personal portfolio: who he is, the technologies he works with and the projects he has built.

He builds full-stack products professionally and spends his own time on side projects, taking ideas from scratch to a working product. He cares about solid architecture and clean, maintainable code.

The site is available in Turkish (default, no prefix) and English (\`/en\` prefix). Every page exists in both languages.

## Pages

- [Home (English)](${BASE_URL}/en): About, tech stack, featured projects and contact form
- [Home (Turkish)](${BASE_URL}/): Same content in Turkish
- [All projects](${BASE_URL}/en/projects): Every published project with status, tags and links

## Projects

${projectLines || "- No published projects yet."}

## Tech stack

${stack}

## Contact

- [GitHub](https://github.com/SertacN): Source code of public projects
- [LinkedIn](https://www.linkedin.com/in/sertacn): Professional profile
- [Email](mailto:contact@sertaccan.com): contact@sertaccan.com
`;

    return new Response(body, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
}
