"use server";

import { revalidatePath } from "next/cache";
import { writeFile, mkdir, unlink } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { createProject, editProject, deleteProject } from "@/lib/server/projects";
import { db } from "@/db";
import { project } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/server/auth";

const UPLOAD_DIR = join(process.cwd(), "uploads");
const ALLOWED_EXT = ["jpg", "jpeg", "png", "webp", "gif"];

async function saveFile(file: File): Promise<{ url: string } | { error: string }> {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!ALLOWED_EXT.includes(ext)) {
        return { error: "Sadece jpg, png, webp, gif yüklenebilir." };
    }
    const filename = `${randomUUID()}.${ext}`;
    await mkdir(UPLOAD_DIR, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(join(UPLOAD_DIR, filename), buffer);
    return { url: `/api/files/${filename}` };
}

export async function createProjectAction(_state: unknown, formData: FormData) {
    await requireAdmin();
    const raw = parseFormData(formData);

    const file = formData.get("file");
    if (file instanceof File && file.size > 0) {
        const result = await saveFile(file);
        if ("error" in result) return { errors: { imageUrl: [result.error] } };
        raw.imageUrl = result.url;
    }

    const result = await createProject(raw);
    if (!result.success) return { errors: result.errors };

    revalidatePath("/admin");
    return { success: true };
}

export async function editProjectAction(_state: unknown, formData: FormData) {
    await requireAdmin();
    const id = formData.get("id") as string;
    if (!id) return { errors: { id: ["ID gerekli"] } };

    const raw = parseFormData(formData);
    raw.imageUrl = (formData.get("imageUrl") as string) ?? "";

    const file = formData.get("file");
    if (file instanceof File && file.size > 0) {
        const oldUrl = raw.imageUrl as string;
        if (oldUrl.startsWith("/api/files/")) {
            try {
                await unlink(join(UPLOAD_DIR, oldUrl.replace("/api/files/", "")));
            } catch {}
        }
        const result = await saveFile(file);
        if ("error" in result) return { errors: { imageUrl: [result.error] } };
        raw.imageUrl = result.url;
    }

    const result = await editProject(id, raw);
    if (!result.success) return { errors: result.errors };

    revalidatePath("/admin");
    return { edited: true };
}

export async function deleteProjectAction(formData: FormData): Promise<void> {
    await requireAdmin();
    const id = formData.get("id") as string;
    if (!id) return;

    const [existing] = await db.select({ imageUrl: project.imageUrl }).from(project).where(eq(project.id, id));
    if (existing?.imageUrl?.startsWith("/api/files/")) {
        try {
            await unlink(join(UPLOAD_DIR, existing.imageUrl.replace("/api/files/", "")));
        } catch {}
    }

    await deleteProject(id);
    revalidatePath("/admin");
}

function parseFormData(formData: FormData): Record<string, unknown> {
    return {
        slug: formData.get("slug"),
        title: formData.get("title"),
        descriptionTr: formData.get("descriptionTr"),
        descriptionEn: formData.get("descriptionEn"),
        longDescriptionTr: formData.get("longDescriptionTr"),
        longDescriptionEn: formData.get("longDescriptionEn"),
        imageUrl: "",
        tags: [
            ...new Set(
                formData
                    .get("tags")
                    ?.toString()
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean) ?? [],
            ),
        ],
        titleEn: formData.get("titleEn") ?? "",
        githubUrl: formData.get("githubUrl") ?? "",
        liveUrl: formData.get("liveUrl") ?? "",
        appStoreUrl: formData.get("appStoreUrl") ?? "",
        googlePlayUrl: formData.get("googlePlayUrl") ?? "",
        status: formData.get("status") ?? "WIP",
        featured: formData.get("featured") === "on",
        order: Number(formData.get("order")) || 0,
        isActive: formData.get("isActive") === "on",
    };
}
