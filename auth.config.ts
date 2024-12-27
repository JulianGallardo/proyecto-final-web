import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { logInSchema } from "./lib/zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";


export default {
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.

      authorize: async (credentials) => {
        const { data, success } = logInSchema.safeParse(credentials);

        if (!success) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: data.email,
          }
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(data.password, user.password);

        if (!isValid) {
          throw new Error("Contraseña incorrecta");	
        }

        return user;


      },
    }),
  ],
} satisfies NextAuthConfig;