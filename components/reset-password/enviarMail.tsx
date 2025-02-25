"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";

const resetPasswordSchema = z.object({
    email: z
        .string()
        .min(1, { message: "El email es requerido" })
        .email({ message: "Debe ser un correo electrónico válido" }),
});


export default function EnviarMailResetPassword() {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(values: { email: string }) {
        setError(null);
        setSuccess(false);

        startTransition(async () => {
            try {
                const response = await fetch("/api/auth/reset-password", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values),
                }).then((res) => res.json());

                console.log(response);
                if(response.status === 200) {
                    setSuccess(true);
                }
                else {
                    setError(response.message);
                }

                
            } catch (err) {
                setError("Hubo un error al enviar el correo. Por favor intenta de nuevo.");
            }
        });
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-blue-50 via-blue-100 to-blue-400 p-2 overflow-hidden">
            <Card className="w-full max-w-3xl shadow-lg rounded-2xl overflow-hidden bg-white">
                <div className="flex flex-col md:flex-row">

                    <div className="w-full p-8 flex flex-col justify-center">
                        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
                            Restablecer contraseña
                        </h2>

                        <p className="text-gray-600 text-center mb-6">
                            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
                        </p>

                        {success ? (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                                Se ha enviado un correo con las instrucciones para restablecer tu contraseña. Por favor revisa tu bandeja de entrada.
                            </div>
                        ) : (
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

                                    {/* Error Message */}
                                    {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-400 rounded-lg py-2"
                                        disabled={isPending}
                                    >
                                        {isPending ? (
                                            <ClipLoader
                                                color="#fff"
                                                loading={isPending}
                                                size={20}
                                            />
                                        ) : (
                                            "Enviar enlace de recuperación"
                                        )}
                                    </Button>

                                    <div className="text-center mt-4">
                                        <Button
                                            type="button"
                                            variant="link"
                                            className="text-blue-600 hover:text-blue-800"
                                            onClick={() => router.push("/login")}
                                        >
                                            Volver a iniciar sesión
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
}