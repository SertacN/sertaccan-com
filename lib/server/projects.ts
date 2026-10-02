import { cache } from "react";
import { db } from "@/db";
import { project } from "@/db/schema";
import { eq, desc, count, and, notInArray } from "drizzle-orm";
import { z } from "zod";
import { projectSchema } from "@/lib/schemas/project-schemas";
import { apiError, apiSuccess } from "@/types";

// ── Queries ──
// -- Get All --
export async function getAllProjects(options?: { page?: number; limit?: number; take?: number; isActive?: boolean }) {
    const page = options?.page ?? 1;
    const limit = options?.take ?? options?.limit ?? 20;
    const offset = (page - 1) * limit;

    const conditions = [
        eq(project.isDeleted, false),
        ...(options?.isActive !== undefined ? [eq(project.isActive, options.isActive)] : []),
    ];
    const where = and(...conditions)!;

    const [projects, [{ total }]] = await Promise.all([
        db
            .select()
            .from(project)
            .where(where)
            .orderBy(desc(project.order), desc(project.createdAt))
            .limit(limit)
            .offset(offset),
        db.select({ total: count() }).from(project).where(where),
    ]);

    return apiSuccess({
        projects,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
}
// -- Get Featured --
// Featured projects for the home page; topped up with the highest-ordered
// projects when fewer than `min` are featured so the section never looks empty.
export async function getFeaturedProjects({ limit = 8, min = 3 }: { limit?: number; min?: number } = {}) {
    const visible = and(eq(project.isDeleted, false), eq(project.isActive, true));
    const ordering = [desc(project.order), desc(project.createdAt)];

    const featured = await db
        .select()
        .from(project)
        .where(and(visible, eq(project.featured, true)))
        .orderBy(...ordering)
        .limit(limit);

    if (featured.length >= min) return apiSuccess(featured);

    const filler = await db
        .select()
        .from(project)
        .where(
            and(
                visible,
                featured.length > 0
                    ? notInArray(
                          project.id,
                          featured.map((p) => p.id),
                      )
                    : undefined,
            ),
        )
        .orderBy(...ordering)
        .limit(min - featured.length);

    return apiSuccess([...featured, ...filler]);
}
// -- Get Details --
// Memoized per request: metadata, JSON-LD and the detail view all read the same project.
export const getDetails = cache(async (slug: string) => {
    const [found] = await db
        .select()
        .from(project)
        .where(and(eq(project.slug, slug), eq(project.isDeleted, false)))
        .limit(1);
    if (!found) return apiError("Proje bulunamadı");
    return apiSuccess(found);
});

// ── Mutations ──
// -- Create --
export async function createProject(raw: unknown) {
    const parsed = projectSchema.safeParse(raw);
    if (!parsed.success) {
        return apiError("Geçersiz veri", z.flattenError(parsed.error).fieldErrors);
    }

    const existing = await db
        .select({ id: project.id })
        .from(project)
        .where(eq(project.slug, parsed.data.slug))
        .limit(1);
    if (existing.length > 0) {
        return apiError("Geçersiz veri", { slug: ["Bu slug zaten kullanımda"] });
    }

    await db.insert(project).values(parsed.data);
    return apiSuccess(null, "Proje oluşturuldu");
}
// -- Edit --
export async function editProject(id: string, raw: unknown) {
    const parsed = projectSchema.safeParse(raw);
    if (!parsed.success) {
        return apiError("Geçersiz veri", z.flattenError(parsed.error).fieldErrors);
    }

    const existing = await db
        .select({ id: project.id })
        .from(project)
        .where(eq(project.slug, parsed.data.slug))
        .limit(1);
    if (existing.length > 0 && existing[0].id !== id) {
        return apiError("Geçersiz veri", { slug: ["Bu slug zaten kullanımda"] });
    }

    await db.update(project).set(parsed.data).where(eq(project.id, id));
    return apiSuccess(null, "Proje güncellendi");
}
// -- Delete --
export async function deleteProject(id: string) {
    await db.delete(project).where(eq(project.id, id));
    return apiSuccess(null, "Proje silindi");
}
