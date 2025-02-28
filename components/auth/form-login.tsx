"use client";
import { loginAction } from "@/actions/auth-actions";
import { z } from "zod";
import { logInSchema } from "@/lib/zod";
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
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import Link from "next/link";

export default function LoginForm() {
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
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
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-blue-50 via-blue-100 to-blue-400 p-2 overflow-hidden">
            <Card className="w-full max-w-3xl shadow-lg rounded-2xl overflow-hidden bg-white">
                <div className="flex flex-col md:flex-row">
                    {/* Imagen - Fixed position container */}
                    <div className="relative w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
                        {/* Fixed size container with absolute positioning */}
                        <div className="absolute inset-0 w-full h-full">
                            <div className="relative w-full h-full">
                                <Image
                                    src="/login.jpg"
                                    alt="Login visual"
                                    className="object-cover"
                                    style={{ objectPosition: 'center center' }}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority
                                />
                            </div>
                        </div>
                    </div>

                    {/* Formulario de inicio de sesión */}
                    <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
                            Iniciar sesión
                        </h2>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {/* Email Field */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">
                                                Email
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="ejemplo@ejemplo.com"
                                                    {...field}
                                                    className="border-gray-300 focus-visible:ring-0 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
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
                                            <FormLabel className="text-sm font-medium text-gray-700">
                                                Contraseña
                                            </FormLabel>
                                            <FormControl>
                                                <div className="flex items-center border shadow-none border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
                                                    <Input
                                                        placeholder="Tu contraseña"
                                                        type={showPassword}
                                                        {...field}
                                                        className="flex-1 border-none focus-visible:ring-0 px-3 py-2 rounded-lg"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        onClick={toggleShowPassword}
                                                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
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
                                {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-400 rounded-lg py-2"
                                    disabled={isPending}
                                >
                                    {isPending ?
                                        <ClipLoader
                                            color="#fff"
                                            loading={isPending}
                                            size={20}
                                        />
                                        : "Iniciar sesión"}
                                </Button>

                                <div className="text-center mt-4">
                                    <Link href="/reset-password">
                                        <Button
                                            type="button"
                                            variant="link"
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </Card>
        </div>
    );
}