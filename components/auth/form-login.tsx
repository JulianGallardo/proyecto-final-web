"use client";
import { loginAction } from "@/actions/auth-actions";
import { z } from 'zod';
import { logInSchema } from '@/lib/zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Eye, EyeSlash } from "@mynaui/icons-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { startTransition, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const [error, setError] = useState<string | null>(null);
    const [isPending] = useTransition();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState("password");

    function toggleShowPassword() {
        setShowPassword((prev) => (prev === "password" ? "text" : "password"));
    }

    const form = useForm<z.infer<typeof logInSchema>>({
        resolver: zodResolver(logInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof logInSchema>) {
        setError(null);
        startTransition(async () => {
            const response = await loginAction(values);
            if (response.error) {
                setError(response.error);
            } else {
                router.push("/inicio");
            }
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 via-blue-100 to-blue-400 p-4">
            <Card className="w-full max-w-md shadow-lg rounded-lg bg-white">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-semibold text-blue-700">Bienvenido</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Email Field */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="example@example.com"
                                                {...field}
                                                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Password Field */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">Contraseña</FormLabel>
                                        <FormControl>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    placeholder="Your password"
                                                    type={showPassword}
                                                    {...field}
                                                    className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={toggleShowPassword}
                                                    className="p-2 text-gray-500 hover:bg-gray-100 hover:border hover:border-blue-500 focus:ring-blue-500"
                                                >
                                                    {showPassword === "password" ? <Eye /> : <EyeSlash />}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Error Message */}
                            {error && (
                                <p className="text-sm text-red-500 font-medium">{error}</p>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-400 disabled:bg-blue-300"
                                disabled={isPending}
                            >
                                {isPending ? "Signing In..." : "Sign In"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
