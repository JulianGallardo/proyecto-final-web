import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { logInSchema } from "./lib/zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { NextURL } from "next/dist/server/web/next-url";
import { NextResponse } from "next/server";
import { anonymousPages, getPermission, userPages } from "./permissions/url_opperations";
import { hasPermission } from "./permissions/hasPermissions";


function redirectWithCallback(nextUrl: NextURL, path: string) {
  const newUrl = new URL(path, nextUrl);
  const callback = nextUrl.searchParams.get('callbackUrl');
  if (callback)
    newUrl.searchParams.set('callbackUrl', callback)
  else
    newUrl.searchParams.set('callbackUrl', nextUrl.toString())
  return Response.redirect(newUrl)
}

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

        return {
          email: user.email,
          id: user.id,
          name: user.name,
          role: user.role
        }


      },
    }),



  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = auth?.user;
      if (anonymousPages.includes(nextUrl.pathname)) {
        return true;
      }
      else {

        if (!isLoggedIn) {
          return Response.redirect(new URL('/login', nextUrl));
        }


        if (userPages.includes(nextUrl.pathname)) return true



        const permission = getPermission(nextUrl.pathname);

        if (!permission) {
          console.error("Permission not found for", nextUrl.pathname)
          return Response.redirect(new URL('/403', nextUrl));
        }
        if (!hasPermission(auth?.user.role, permission)) {
          console.log(`User with role ${auth?.user.role} tried to access ${JSON.stringify(permission)}`);
          return Response.redirect(new URL('/403', nextUrl));
        }
      }

      return true;
    },

    redirect({ url, baseUrl }) {
      const urlObject = new URL(url)
      const callbackUrl = urlObject.searchParams.get('callbackUrl')
      if (callbackUrl) {
        url = callbackUrl
      }

      // default behavior
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl

    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  }

} satisfies NextAuthConfig;