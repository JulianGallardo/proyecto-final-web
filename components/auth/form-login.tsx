"use client";
import { loginAction } from "@/actions/auth-actions";
import { z } from 'zod';
import { logInSchema } from '@/lib/zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Eye,EyeSlash } from "@mynaui/icons-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { startTransition, useState, useTransition } from "react";
import { useRouter } from "next/navigation";


export default function LoginForm() {
    const [error, setError] = useState<string | null>(null);
    const [isPending, setIsPending] = useTransition();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState("password");

    function toggleShowPassword() {
        setShowPassword((prev) => prev === "password" ? "text" : "password");

    }




    const form = useForm<z.infer<typeof logInSchema>>({
        resolver: zodResolver(logInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof logInSchema>) {
        setError(null);
        startTransition(async () => {
            const response = await loginAction(values);
            if (response.error) {
                setError(response.error);
                console.log(response.error);
            } else {
                router.push("/inicio");
            }
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="space-y-2">
                                            <FormLabel htmlFor="email">Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="example@example.com" {...field} />

                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>

                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="space-y-2">
                                            <FormLabel htmlFor="email">Password</FormLabel>
                                            <FormControl>
                                                <div className="flex flex-row gap-2">
                                                    <Input placeholder="Your password" type={showPassword}  {...field} />


                                                    <Button type="button" variant={"outline"}  onClick={toggleShowPassword} className="w-fit">
                                                        {showPassword === "password" ? <Eye /> : <EyeSlash />}
                                                    </Button>

                                                </div>


                                            </FormControl>



                                        </div>
                                        <FormMessage />
                                    </FormItem>

                                )}
                            />



                            {
                                error && <FormMessage>{error}</FormMessage>
                            }


                            <Button type="submit" className="w-full" disabled={isPending}>Sign In</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}