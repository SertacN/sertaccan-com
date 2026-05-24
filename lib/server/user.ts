import { db } from "@/db";
import { user } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { headers } from "next/headers";
import { apiSuccess, apiError } from "@/types";
import type { ApiResponse } from "@/types";
import { auth } from "./auth";
import type { ProfileInput, PasswordInput, CreateUserInput } from "@/lib/schemas/user-schemas";

// ── Queries ──

export async function listUser() {
    const users = await db
        .select({ id: user.id, name: user.name, email: user.email, banned: user.banned, role: user.role, createdAt: user.createdAt })
        .from(user)
        .orderBy(desc(user.createdAt));
    return apiSuccess({ users });
}

// ── Mutations ──

export async function updateProfile(userId: string, data: ProfileInput): Promise<ApiResponse<null>> {
    try {
        await db.update(user).set({ name: data.name, email: data.email }).where(eq(user.id, userId));
        return apiSuccess(null, "Profil güncellendi");
    } catch {
        return apiError("Güncelleme başarısız", { _: ["Güncelleme başarısız"] });
    }
}

export async function changePassword(data: PasswordInput): Promise<ApiResponse<null>> {
    try {
        await auth.api.changePassword({
            body: { currentPassword: data.currentPassword, newPassword: data.newPassword, revokeOtherSessions: false },
            headers: await headers(),
        });
        return apiSuccess(null, "Şifre değiştirildi");
    } catch {
        return apiError("Mevcut şifre yanlış", { _: ["Mevcut şifre yanlış"] });
    }
}

export async function createUser(data: CreateUserInput): Promise<ApiResponse<null>> {
    try {
        await auth.api.createUser({
            body: { name: data.name, email: data.email, password: data.password, role: data.role },
            headers: await headers(),
        });
        return apiSuccess(null, "Kullanıcı oluşturuldu");
    } catch {
        return apiError("Kullanıcı oluşturulamadı", { _: ["Kullanıcı oluşturulamadı (email zaten kullanımda olabilir)"] });
    }
}

export async function deleteUser(userId: string): Promise<ApiResponse<null>> {
    try {
        await auth.api.removeUser({ body: { userId }, headers: await headers() });
        return apiSuccess(null, "Kullanıcı silindi");
    } catch {
        return apiError("Silme başarısız", { _: ["Silme başarısız"] });
    }
}

export async function banUser(userId: string): Promise<ApiResponse<null>> {
    try {
        await auth.api.banUser({ body: { userId }, headers: await headers() });
        return apiSuccess(null, "Kullanıcı yasaklandı");
    } catch {
        return apiError("Yasaklama başarısız", { _: ["Yasaklama başarısız"] });
    }
}

export async function unbanUser(userId: string): Promise<ApiResponse<null>> {
    try {
        await auth.api.unbanUser({ body: { userId }, headers: await headers() });
        return apiSuccess(null, "Yasak kaldırıldı");
    } catch {
        return apiError("Yasak kaldırılamadı", { _: ["Yasak kaldırılamadı"] });
    }
}
