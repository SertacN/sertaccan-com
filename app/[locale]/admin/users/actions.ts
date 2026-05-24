"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { auth, requireAdmin } from "@/lib/server/auth";
import { updateProfile, changePassword, createUser, deleteUser, banUser, unbanUser } from "@/lib/server/user";
import { profileSchema, passwordSchema, createUserSchema } from "@/lib/schemas/user-schemas";

type ActionResult = { action: string; success?: boolean; errors?: Record<string, string[]> } | null;

export async function updateProfileAction(_state: unknown, formData: FormData): Promise<ActionResult> {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { action: "profile", errors: { _: ["Oturum açık değil"] } };

    const result = profileSchema.safeParse(Object.fromEntries(formData));
    if (!result.success) return { action: "profile", errors: z.flattenError(result.error).fieldErrors };

    const res = await updateProfile(session.user.id, result.data);
    if (!res.success) return { action: "profile", errors: res.errors ?? {} };

    revalidatePath("/admin/users");
    return { action: "profile", success: true };
}

export async function updatePasswordAction(_state: unknown, formData: FormData): Promise<ActionResult> {
    const result = passwordSchema.safeParse(Object.fromEntries(formData));
    if (!result.success) return { action: "password", errors: z.flattenError(result.error).fieldErrors };

    const res = await changePassword(result.data);
    if (!res.success) return { action: "password", errors: res.errors ?? {} };

    return { action: "password", success: true };
}

export async function createUserAction(_state: unknown, formData: FormData): Promise<ActionResult> {
    await requireAdmin();

    const result = createUserSchema.safeParse(Object.fromEntries(formData));
    if (!result.success) return { action: "create", errors: z.flattenError(result.error).fieldErrors };

    const res = await createUser(result.data);
    if (!res.success) return { action: "create", errors: res.errors ?? {} };

    revalidatePath("/admin/users");
    return { action: "create", success: true };
}

export async function deleteUserAction(formData: FormData): Promise<void> {
    await requireAdmin();
    const session = await auth.api.getSession({ headers: await headers() });
    const id = formData.get("id") as string;
    if (!id || id === session?.user.id) return;

    await deleteUser(id);
    revalidatePath("/admin/users");
}

export async function banUserAction(formData: FormData): Promise<void> {
    await requireAdmin();
    const id = formData.get("id") as string;
    if (!id) return;

    await banUser(id);
    revalidatePath("/admin/users");
}

export async function unbanUserAction(formData: FormData): Promise<void> {
    await requireAdmin();
    const id = formData.get("id") as string;
    if (!id) return;

    await unbanUser(id);
    revalidatePath("/admin/users");
}
