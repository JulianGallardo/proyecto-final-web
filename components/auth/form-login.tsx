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
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <Card className="w-full flex flex-col  md:max-w-3xl mx-auto md:flex-grow-0 shadow-xl rounded-lg overflow-hidden border border-gray-200 ">
                <div className="flex flex-col h-full md:flex-row">
                    {/* Panel with logo - responsive height */}
                    <div className="relative w-full md:w-1/2 h-auto py-6 overflow-hidden bg-white">
                        <div className="flex flex-col items-center justify-center p-4">
                            {/* Logo de Sistema de Notificaciones */}
                            <div className="w-48 md:w-64 mb-2">
                                <Image
                                    src="/login.png"
                                    alt="Sistema de notificaciones"
                                    width={300}
                                    height={120}
                                    style={{
                                        width: 'auto',
                                        height: 'auto',
                                        maxWidth: '100%',
                                        objectFit: 'contain'
                                    }}
                                    priority
                                />
                            </div>
                            
                            {/* Contenido adicional bajo el logo */}
                            <div className="text-blue-700 text-center mt-2">
                                <h2 className="text-lg md:text-xl font-medium">Portal de Acceso</h2>
                                <p className="text-xs md:text-sm text-gray-600 mt-1">Acceda al sistema de notificaciones</p>
                            </div>
                        </div>
                        
                        {/* Decoración inferior */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-700"></div>
                    </div>

                    {/* Formulario de inicio de sesión */}
                    <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col justify-center bg-white flex-grow">
                        <div className="mb-4 text-center">
                            <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">
                                Iniciar sesión
                            </h2>
                            <p className="text-sm text-gray-500">Ingrese sus credenciales para continuar</p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-grow flex flex-col">
                                <div className="space-y-4 flex-grow">
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
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <svg className="h-4 w-4 md:h-5 md:w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                        <Input
                                                            placeholder="ejemplo@ejemplo.com"
                                                            {...field}
                                                            className="pl-10 border-gray-300 focus-visible:ring-0 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm text-sm"
                                                        />
                                                    </div>
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
                                                    <div className="flex items-center border shadow-sm border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 bg-white">
                                                        <div className="pl-3">
                                                            <svg className="h-4 w-4 md:h-5 md:w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                            </svg>
                                                        </div>
                                                        <Input
                                                            placeholder="Tu contraseña"
                                                            type={showPassword}
                                                            {...field}
                                                            className="flex-1 border-none focus-visible:ring-0 px-3 py-2 rounded-lg text-sm"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            onClick={toggleShowPassword}
                                                            className="p-1 md:p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                                                        >
                                                            {showPassword === "password" ? <Eye className="h-4 w-4 md:h-5 md:w-5" /> : <EyeSlash className="h-4 w-4 md:h-5 md:w-5" />}
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Error Message */}
                                    {error && (
                                        <div className="bg-red-50 border-l-4 border-red-500 p-2 md:p-3 rounded">
                                            <p className="text-xs md:text-sm text-red-600 font-medium">{error}</p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="w-full bg-blue-700 text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-400 rounded-lg py-2 shadow-md transition-all duration-300 transform hover:translate-y-px text-sm md:text-base"
                                        disabled={isPending}
                                    >
                                        {isPending ?
                                            <ClipLoader
                                                color="#fff"
                                                loading={isPending}
                                                size={18}
                                            />
                                            : "Iniciar sesión"}
                                    </Button>

                                    <div className="text-center mt-3 pt-2 border-t border-gray-100">
                                        <Link href="/reset-password">
                                            <Button
                                                type="button"
                                                variant="link"
                                                className="text-blue-600 hover:text-blue-800 text-sm"
                                            >
                                                ¿Olvidaste tu contraseña?
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </Card>
        </div>
    );
}