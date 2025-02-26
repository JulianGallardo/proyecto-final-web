import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { randomBytes } from "crypto";

export const POST = async (req: NextRequest) => {
    try {
        // Parse the request body
        const { email } = await req.json();

        if (!email || typeof email !== "string") {
            return NextResponse.json(
                { message: "El correo electrónico es requerido" },
                { status: 400 }
            );
        }

        // Find the user in the database
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { message: "Usuario no encontrado" },
                { status: 404 }
            );
        }

        // Generate a secure token
        const token = randomBytes(32).toString("hex");

        // Save the token in the database with expiration (24 hours)
        await prisma.token.create({
            data: {
                hashedToken: token,
                expiration: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
                userId: user.id,
            },
        });

        // Create the reset link - replace with your frontend URL
        /* eslint-disable */
        const resetLink = `${process.env.FRONTEND_URL ?? "http://localhost:3000"}/reset-password?token=${token}`;

        // Configure nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "87e22d57bf8ba8",
                pass: "6f6a6643f67fcc",
            },
        });

        // Build a professional HTML email in Spanish
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #333; text-align: center;">Restablecimiento de Contraseña</h1>
        <p>Hola ${user.name ?? user.email},</p>
        <p>Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el botón a continuación para crear una nueva contraseña:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #4a69bd; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Restablecer Contraseña</a>
        </div>
        <p>Este enlace caducará en 24 horas.</p>
        <p>Si no solicitaste un restablecimiento de contraseña, puedes ignorar este correo electrónico.</p>
        <p>Gracias,<br>El Equipo de tu Aplicación</p>
      </div>
    `;

        // Send the email
        await transporter.sendMail({
            from: "noreply.sistemagestioninstrumentos@test.com",
            to: email, // Use the provided email instead of a hardcoded one
            subject: "Restablece tu contraseña",
            html,
        });


        return NextResponse.json(
            {
                message: "Correo de restablecimiento de contraseña enviado",
                status: 200
            }
        );
    } catch (error) {

        let errorMessage = "Error al procesar el restablecimiento de contraseña";
        let statusCode = 500;

        if (error instanceof Error) {
            if (error.message.includes("Invalid login") || error.message.includes("Authentication failed")) {
                errorMessage = "Credenciales de correo inválidas";
                statusCode = 401;
            } else if (error.message.includes("User not found")) {
                errorMessage = "Usuario no encontrado";
                statusCode = 404;
            }
        }

        return NextResponse.json(
            {
                message: errorMessage, error: (error as Error).message,
                status: statusCode
            }
        );
    } finally {
        // Ensure Prisma connection is closed (optional, as Prisma manages connections automatically)
        await prisma.$disconnect().catch(console.error);
    }
};