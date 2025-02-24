"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

interface ErrorPageProps {
  error?: Error | string; // Optional error prop to display specific error details
  reset?: () => void; // Optional reset function for retrying
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error, reset }) => {
  // Log the error for debugging (remove in production or use a logging service)
  useEffect(() => {
    if (error) {
      console.error("Error en la página:", error instanceof Error ? error.message : error);
    }
  }, [error]);

  const getErrorMessage = () => {
    if (!error) return "¡Ups! Algo salió mal.";
    if (error instanceof Error) return error.message;
    return error;
  };

  return (
    <div className="flex items-center justify-center min-h-full bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{getErrorMessage()}</AlertDescription>
        </Alert>

        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">¡Ups! Ocurrió un Error</h1>
          <p className="text-gray-600">
            Ocurrio un error inesperado. No te preocupes, puedes intentarlo de nuevo o regresar al inicio.
          </p>

          <div className="flex justify-center gap-4">
            {reset && (
              <Button
                onClick={reset}
                variant="outline"
                className="hover:bg-gray-100 transition-colors"
              >
                Intentar de Nuevo
              </Button>
            )}
            <Link href="/inicio" passHref>
              <Button className="bg-primary hover:bg-primary-dark text-white transition-colors">
                Regresar al listado
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;