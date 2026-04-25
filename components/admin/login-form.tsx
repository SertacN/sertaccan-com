"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { signIn } from "@/lib/auth-client";
import { loginSchema, type LoginSchema } from "@/lib/schemas/auth-schemas";

export default function LoginForm() {
    const router = useRouter();
    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = async (values: LoginSchema) => {
        const result = await signIn.email({
            email: values.email,
            password: values.password,
        });

        if (result.error) {
            setError("root", { message: result.error.message });
            return;
        }

        router.push("/admin");
    };

    return (
        <div className="flex min-h-[80vh] w-full items-center justify-center">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-sm rounded border border-border bg-card p-8"
            >
                <h1 className="mb-6 font-mono text-xl font-bold text-primary">Admin Girişi</h1>

                <FieldGroup>
                    <Field data-invalid={!!errors.email}>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Controller
                            control={control}
                            name="email"
                            render={({ field }) => (
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Email"
                                    autoComplete="email"
                                    aria-invalid={!!errors.email}
                                    {...field}
                                />
                            )}
                        />
                        <FieldError errors={[errors.email]} />
                    </Field>

                    <Field data-invalid={!!errors.password}>
                        <FieldLabel htmlFor="password">Şifre</FieldLabel>
                        <Controller
                            control={control}
                            name="password"
                            render={({ field }) => (
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Şifre"
                                    autoComplete="current-password"
                                    aria-invalid={!!errors.password}
                                    {...field}
                                />
                            )}
                        />
                        <FieldError errors={[errors.password]} />
                    </Field>

                    {errors.root && <FieldError>{errors.root.message}</FieldError>}

                    <Field orientation="horizontal" className="justify-end">
                        {!isSubmitting && (
                            <Button type="reset" variant="outline">
                                Reset
                            </Button>
                        )}
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Bekleyiniz..." : "Giriş Yap"}
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        </div>
    );
}
