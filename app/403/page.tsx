"use client";
import Error403 from "@/components/error/error403";
import React from "react";


export default function ErrorNotPermission() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Error403 error={new Error("No tienes permisos para acceder a esta página")} />
    </div>
  );
};


