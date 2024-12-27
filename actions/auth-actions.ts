"use server";

import { logInSchema } from "@/lib/zod";
import { signIn } from "@/auth";
import { z } from "zod";
import { AuthError } from "next-auth";

export const loginAction = async (values: z.infer<typeof logInSchema>) => {
    try {
        await signIn('credentials', {
            email: values.email,
            password: values.password,
            redirect: false,
        });
        return {succes: true};
    } catch (error) {
        if (error instanceof AuthError) {
            return { error: error.cause?.err?.message };
        }
        return { error: 'error 500' };
    }
}