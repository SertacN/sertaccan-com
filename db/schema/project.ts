import { pgTable, pgEnum, text, boolean, integer, timestamp, uuid } from "drizzle-orm/pg-core";

export const projectStatusEnum = pgEnum("project_status", ["ACTIVE", "WIP", "ARCHIVED"]);

export const project = pgTable("project", {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    descriptionTr: text("description_tr").notNull(),
    descriptionEn: text("description_en").notNull(),
    longDescriptionTr: text("long_description_tr").notNull(),
    longDescriptionEn: text("long_description_en").notNull(),
    imageUrl: text("image_url"),
    tags: text("tags").array().notNull().default([]),
    githubUrl: text("github_url"),
    liveUrl: text("live_url"),
    status: projectStatusEnum("status").default("WIP").notNull(),
    featured: boolean("featured").default(false).notNull(),
    order: integer("order").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    isDeleted: boolean("is_deleted").default(false).notNull(),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});
