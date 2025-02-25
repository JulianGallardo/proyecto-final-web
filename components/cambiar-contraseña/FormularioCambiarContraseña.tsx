"use client";

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
import { Card } from "@/components/ui/card";
import { useEffect, useState, useTransition } from "react";
import { ClipLoader } from "react-spinners";
import { changePassword } from "@/actions/auth-actions";
import { Session } from "next-auth";
import { changePasswordSchema } from "@/lib/zod";
import { z } from "zod";

// Client Component for the form
export default function ClientCambiarContraseña({ session }: Readonly<{ session: Session }>) {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [showCurrentPassword, setShowCurrentPassword] = useState("password");
    const [showNewPassword, setShowNewPassword] = useState("password");
    const [showConfirmPassword, setShowConfirmPassword] = useState("password");

    const form = useForm<z.infer<typeof changePasswordSchema>>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const toggleShowCurrentPassword = () => {
        setShowCurrentPassword((prev) => (prev === "password" ? "text" : "password"));
    };

    const toggleShowNewPassword = () => {
        setShowNewPassword((prev) => (prev === "password" ? "text" : "password"));
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword((prev) => (prev === "password" ? "text" : "password"));
    };



    const onSubmit = async (values: z.infer<typeof changePasswordSchema>) => {
        setError(null);
        startTransition(async () => {

            console.log(session.user);
            try {
                if(!session.user.email ){
                    setError("No se ha podido obtener la información del usuario");
                    return;
                }


                const response = await changePassword(
                    session.user.email, // Use the user ID from the session
                    values.currentPassword,
                    values.newPassword
                );

                console.log(response);
                if (response.success) {
                    setSuccess(true);
                    setTimeout(() => {
                        form.reset(); // Clear the form after success
                    }, 3000);
                } else if (response.error) {
                    setError(response.error);
                }
            } catch (err) {
                setError("Ha ocurrido un error al cambiar la contraseña");
            }
        });
    };

    return (
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 p-4 overflow-hidden">
            <Card className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
                <div className="flex flex-col md:flex-row">
                    <div className="w-full p-8 flex flex-col justify-center space-y-6">
                        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4 tracking-tight">
                            Cambiar Contraseña
                        </h2>

                        {success ? (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                                <p className="flex font-medium items-center justify-center">¡Contraseña cambiada con éxito!</p>
                            </div>
                        ) : (
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                    <FormField
                                        control={form.control}
                                        name="currentPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Contraseña Actual
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
                                                        <Input
                                                            placeholder="Ingresa tu contraseña actual"
                                                            type={showCurrentPassword}
                                                            {...field}
                                                            className="flex-1 border-none focus-visible:ring-0 px-4 py-2 text-sm rounded-l-lg transition-all duration-200"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            onClick={toggleShowCurrentPassword}
                                                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-r-lg transition-all duration-200"
                                                        >
                                                            {showCurrentPassword === "password" ? <Eye className="h-5 w-5" /> : <EyeSlash className="h-5 w-5" />}
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-red-500 text-xs" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="newPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Nueva Contraseña
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
                                                        <Input
                                                            placeholder="Ingresa una nueva contraseña"
                                                            type={showNewPassword}
                                                            {...field}
                                                            className="flex-1 border-none focus-visible:ring-0 px-4 py-2 text-sm rounded-l-lg transition-all duration-200"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            onClick={toggleShowNewPassword} // Fixed: Removed arrow function and used direct function reference
                                                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-r-lg transition-all duration-200"
                                                        >
                                                            {showNewPassword === "password" ? <Eye className="h-5 w-5" /> : <EyeSlash className="h-5 w-5" />}
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-red-500 text-xs" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Confirmar Contraseña
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
                                                        <Input
                                                            placeholder="Confirma tu nueva contraseña"
                                                            type={showConfirmPassword}
                                                            {...field}
                                                            className="flex-1 border-none focus-visible:ring-0 px-4 py-2 text-sm rounded-l-lg transition-all duration-200"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            onClick={toggleShowConfirmPassword} // Fixed: Removed arrow function and used direct function reference
                                                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-r-lg transition-all duration-200"
                                                        >
                                                            {showConfirmPassword === "password" ? <Eye className="h-5 w-5" /> : <EyeSlash className="h-5 w-5" />}
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-red-500 text-xs" />
                                            </FormItem>
                                        )}
                                    />

                                    {error && (
                                        <div className="text-center">
                                            <p className="text-sm text-red-500 font-medium">{error}</p>
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-400 rounded-lg py-2.5 transition-all duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
                                        disabled={isPending}
                                    >
                                        {isPending ? (
                                            <ClipLoader color="#fff" loading={isPending} size={20} />
                                        ) : (
                                            "Cambiar Contraseña"
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
}