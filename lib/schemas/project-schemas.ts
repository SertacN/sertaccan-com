import { z } from "zod";

export const projectSchema = z.object({
    slug: z.string().min(1, "Slug zorunlu"),
    title: z.string().min(1, "Başlık zorunlu"),
    descriptionTr: z.string().min(1, "Açıklama (TR) zorunlu"),
    descriptionEn: z.string().min(1, "Açıklama (EN) zorunlu"),
    longDescriptionTr: z.string().min(1, "Uzun açıklama (TR) zorunlu"),
    longDescriptionEn: z.string().min(1, "Uzun açıklama (EN) zorunlu"),
    imageUrl: z.string().default(""),
    tags: z.array(z.string()).default([]),
    githubUrl: z.string().default(""),
    liveUrl: z.string().default(""),
    status: z.enum(["ACTIVE", "WIP", "ARCHIVED"]).default("WIP"),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    isActive: z.boolean().default(true),
});

export type ProjectSchema = z.infer<typeof projectSchema>;
