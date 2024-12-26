import NextAuth from "next-auth";
import { ZodError } from "zod";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "@/lib/zod";
import bcrypt from 'bcryptjs'; // Use bcryptjs instead of bcrypt
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/db";
import UserRepository from "./repositories/UserRepository";

const userRepository = new UserRepository();

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          // Validate input using Zod schema
          const { email, password } = await signInSchema.parseAsync(credentials);

          // Fetch user by email
          const user = await userRepository.getByEmail(email);

          if (!user) {
            throw new Error("Invalid credentials.");
          }

          // Verify the password
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            throw new Error("Invalid credentials.");
          }

          // Return user object in the expected format
          return {
            id: user.id.toString(), // Convert id to string
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          if (error instanceof ZodError) {
            console.error("Validation error:", error.errors);
          } else {
            console.error("Authorization error:", (error as Error).message);
          }
          // Return null to indicate an invalid login attempt
          return null;
        }
      },
    }),
  ],
});
