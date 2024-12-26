"use client";

import { z } from 'zod';
import { logInSchema } from '@/lib/zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '@radix-ui/react-label';

export default function LoginForm() {
    const form = useForm<z.infer<typeof logInSchema>>({
        resolver: zodResolver(logInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof logInSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">Sign In</CardTitle>
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
                                            <Input  placeholder="example@example.com" {...field} />

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
                                            <Input  placeholder="Your password" {...field} />

                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                    
                                )}
                            />


                            <Button type="submit" className="w-full">Sign In</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}