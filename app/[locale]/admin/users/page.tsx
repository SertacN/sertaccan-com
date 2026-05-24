import { headers } from "next/headers";
import { auth } from "@/lib/server/auth";
import { listUser } from "@/lib/server/user";
import UserProfileForm from "@/components/admin/user-profile-form";
import UserPasswordForm from "@/components/admin/user-password-form";
import UserManagement from "@/components/admin/user-management";

export default async function UsersPage() {
    const h = await headers();
    const session = await auth.api.getSession({ headers: h });
    const { data } = await listUser();

    return (
        <div className="flex flex-col gap-8">
            <h1 className="font-mono text-2xl font-bold text-primary">Kullanıcılar</h1>
            <UserProfileForm user={session?.user ?? null} />
            <UserPasswordForm user={session?.user ?? null} />
            {session?.user.role === "admin" && (
                <UserManagement users={data?.users ?? []} currentUserId={session.user.id} />
            )}
        </div>
    );
}
