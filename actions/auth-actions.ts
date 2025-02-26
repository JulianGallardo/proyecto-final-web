"use server";

import { logInSchema, newPasswordSchema } from "@/lib/zod";
import { signIn } from "@/auth";
import { z } from "zod";
import { AuthError } from "next-auth";
import prisma from "@/lib/db";
import { hashPassword } from "@/lib/utils";
import bcrypt from "bcryptjs";

export const loginAction = async (values: z.infer<typeof logInSchema>) => {
    try {
        await signIn('credentials', {
            email: values.email,
            password: values.password,
            redirect: false,
        });
        return { succes: true };
    } catch (error) {
        if (error instanceof AuthError) {
            return { error: error.cause?.err?.message };
        }
        return { error: 'error 500' };
    }
}

export const resetPasswordAction = async (token: string, values: z.infer<typeof newPasswordSchema>) => {
    const tokenInBDD = await prisma.token.findFirst({
        where: {
            hashedToken: token,
        },
    });

    if (!tokenInBDD) {
        return { error: "Token not found" };
    }

    if (tokenInBDD.expiration < new Date()) {
        return { error: "Token expired" };
    }

    const user = await prisma.user.findUnique({
        where: {
            id: tokenInBDD.userId,
        },
    });

    if (!user) {
        return { error: "User not found" };
    }

    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            password: await hashPassword(values.password),
        },
    });

    return { success: true };
}

export const validateToken = async (token: string) => {
    const tokenInBDD = await prisma.token.findFirst({
        where: {
            hashedToken: token,
        },
    });

    if (!tokenInBDD) {
        return { error: "Token not found" };
    }

    if (tokenInBDD.expiration < new Date()) {
        return { error: "Token expired" };
    }

    return { success: true };
}

export const changePassword = async (email: string, oldPassword: string, newPassword: string) => {
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });

    if (!user) {
        return { error: "Usuario no encontrado" };
    }

    if (!user.password) {
        return { error: "Usuario no encontrado" };
    }

    const compare = await bcrypt.compare(oldPassword, user.password);

    if (!compare) {
        return { error: "La contraseña actual es incorrecta." };
    }

    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            password: await hashPassword(newPassword),
        },
    });

    return { success: true };
}