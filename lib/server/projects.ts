import { db } from "@/db";
import { project } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { projectSchema } from "@/lib/schemas/project-schemas";

export async function getAllProjects() {
    return db
        .select()
        .from(project)
        .where(eq(project.isDeleted, false))
        .orderBy(desc(project.order), desc(project.createdAt));
}

export async function createProject(raw: unknown) {
    const parsed = projectSchema.safeParse(raw);
    if (!parsed.success) {
        return { success: false, errors: z.flattenError(parsed.error).fieldErrors };
    }

    const existing = await db.select({ id: project.id }).from(project).where(eq(project.slug, parsed.data.slug)).limit(1);
    if (existing.length > 0) {
        return { success: false, errors: { slug: ["Bu slug zaten kullanımda"] } };
    }

    await db.insert(project).values(parsed.data);
    return { success: true };
}

export async function editProject(id: string, raw: unknown) {
    const parsed = projectSchema.safeParse(raw);
    if (!parsed.success) {
        return { success: false, errors: z.flattenError(parsed.error).fieldErrors };
    }

    const existing = await db.select({ id: project.id }).from(project)
        .where(eq(project.slug, parsed.data.slug))
        .limit(1);
    if (existing.length > 0 && existing[0].id !== id) {
        return { success: false, errors: { slug: ["Bu slug zaten kullanımda"] } };
    }

    await db.update(project).set(parsed.data).where(eq(project.id, id));
    return { success: true };
}

export async function deleteProject(id: string) {
    await db
        .update(project)
        .set({ isDeleted: true, deletedAt: new Date() })
        .where(eq(project.id, id));
}
