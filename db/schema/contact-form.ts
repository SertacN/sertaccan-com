import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const contactForm = pgTable("contact_form", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    subject: text("subject").notNull(),
    message: text("message").notNull(),
    isRead: boolean().default(false),
    repliedAt: timestamp("replied_at").$onUpdate(() => new Date()),
    replyMessage: text("reply_message"),
});
