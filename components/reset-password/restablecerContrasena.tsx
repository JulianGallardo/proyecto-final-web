"use client";

import { z } from "zod";
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
import { useState, useTransition, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { newPasswordSchema } from "@/lib/zod";
import { resetPasswordAction, validateToken } from "@/actions/auth-actions";
import { Skeleton } from "@/components/ui/skeleton";

interface RestablecerContrasenaProps {
  tokenServer: string;
}

export default function RestablecerContraseña({ tokenServer }: Readonly<RestablecerContrasenaProps>) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState("password");
  const [showConfirmPassword, setShowConfirmPassword] = useState("password");
  const [token, setToken] = useState<string | null>(null);
  const [isLoadingToken, setIsLoadingToken] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchToken = async () => {
      setIsLoadingToken(true);
      try {
        if (tokenServer) {
          const validate = await validateToken(tokenServer);
          if (validate.success) {
            setToken(tokenServer);
          } else {
            setError("Token de restablecimiento no válido o expirado");
          }
        } else {
          setError("No se proporcionó un token de restablecimiento");
        }
      } catch (err) {
        console.error(err);
        setError("Ha ocurrido un error al validar el token");
      } finally {
        setIsLoadingToken(false);
      }
    };

    fetchToken();
  }, [tokenServer, pathname]);

  const form = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  function toggleShowPassword() {
    setShowPassword((prev) => (prev === "password" ? "text" : "password"));
  }

  function toggleShowConfirmPassword() {
    setShowConfirmPassword((prev) => (prev === "password" ? "text" : "password"));
  }

  async function onSubmit(values: z.infer<typeof newPasswordSchema>) {
    setError(null);

    if (!token) {
      setError("Token de restablecimiento no válido o expirado");
      return;
    }

    startTransition(async () => {
      try {
        const response = await resetPasswordAction(token, values);
        if (response.success) {
          setSuccess(true);
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        } else if (response.error) {
          setError(response.error);
        }
      } catch (err) {
        console.error(err);
        setError("Ha ocurrido un error al procesar tu solicitud");
      }
    });
  }

  // Función para renderizar el contenido basado en el estado
  const renderContent = () => {
    if (isLoadingToken) {
      return (
        <div className="space-y-6">
          <Skeleton className="h-10 w-full mx-auto rounded-lg" />
          <Skeleton className="h-10 w-full mx-auto rounded-lg" />
          <Skeleton className="h-4 w-1/4 mx-auto rounded" />
        </div>
      );
    }

    if (!token) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error ?? "Token de restablecimiento no válido o expirado. Por favor solicita un nuevo enlace de restablecimiento."}
        </div>
      );
    }

    if (success) {
      return (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">¡Contraseña actualizada con éxito!</p>
          <p className="mt-2">Serás redirigido a la página de inicio de sesión en unos segundos...</p>
        </div>
      );
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Nueva contraseña
                </FormLabel>
                <FormControl>
                  <div className="flex items-center border shadow-none border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
                    <Input
                      placeholder="Ingresa tu nueva contraseña"
                      type={showPassword}
                      {...field}
                      className="flex-1 border-none focus-visible:ring-0 px-3 py-2 rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={toggleShowPassword}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                    >
                      {showPassword === "password" ? <Eye /> : <EyeSlash />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Confirmar contraseña
                </FormLabel>
                <FormControl>
                  <div className="flex items-center border shadow-none border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
                    <Input
                      placeholder="Confirma tu nueva contraseña"
                      type={showConfirmPassword}
                      {...field}
                      className="flex-1 border-none focus-visible:ring-0 px-3 py-2 rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={toggleShowConfirmPassword}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                    >
                      {showConfirmPassword === "password" ? <Eye /> : <EyeSlash />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Error Message */}
          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-400 rounded-lg py-2"
            disabled={isPending}
          >
            {isPending ? (
              <ClipLoader color="#fff" loading={isPending} size={20} />
            ) : (
              "Establecer nueva contraseña"
            )}
          </Button>
        </form>
      </Form>
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-blue-50 via-blue-100 to-blue-400 p-2 overflow-hidden">
      <Card className="w-full max-w-3xl shadow-lg rounded-2xl overflow-hidden bg-white">
        <div className="flex flex-col md:flex-row">
          {/* Formulario de nueva contraseña */}
          <div className="w-full p-8 flex flex-col justify-center">
            {renderContent()}

            <div className="text-center mt-6">
              <Button
                type="button"
                variant="link"
                className="text-blue-600 hover:text-blue-800"
                onClick={() => router.push("/login")}
              >
                Volver a iniciar sesión
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}