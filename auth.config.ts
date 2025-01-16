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
          throw new Error("El usuario o la contraseña son incorrectos");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: data.email,
          }
        });

        if (!user?.password) {
          throw new Error("El usuario o la contraseña son incorrectos");
        }

        const isValid = await bcrypt.compare(data.password, user.password);

        if (!isValid) {
          throw new Error("El usuario o la contraseña son incorrectos");
        }

        return user;


      },
    }),
    
  ],
  
} satisfies NextAuthConfig;