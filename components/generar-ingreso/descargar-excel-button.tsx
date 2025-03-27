"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import SearchParamsInstrumentos from "@/types/searchParams";

interface DescargarExcelButtonProps {
  searchParams: SearchParamsInstrumentos;
  agenteId: number;
}

export default function DescargarExcelButton({ searchParams, agenteId }: Readonly<DescargarExcelButtonProps>) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      // Disable button and show loading state
      setIsDownloading(true);

      // Create a record of string keys to string values for URLSearchParams
      const queryParams: Record<string, string> = Object.entries(searchParams)
        .reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = String(value);
          }
          return acc;
        }, {} as Record<string, string>);
      
      // Add the agenteId parameter
      const url = new URLSearchParams({...queryParams, agenteId: agenteId.toString()}).toString();
      const response = await fetch(`/api/excel-instrumentos-agente?${url}`);
      
      if (!response.ok) {
        throw new Error('Error al generar el archivo Excel');
      }
      
      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a link element to download the file
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Get filename from Content-Disposition header or use a default name
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'instrumentos-agente.xlsx'; // Default filename
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      link.download = filename;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading Excel file:', error);
      alert('Error al descargar el archivo Excel');
    } finally {
      // Re-enable button
      setIsDownloading(false);
    }
  };

  return (
    <Button 
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-fit"
      onClick={handleDownload}
      disabled={isDownloading}
    >
      {isDownloading ? (
        <>
          <Loader2 size={16} className="mr-2 animate-spin" />
          Descargando...
        </>
      ) : (
        <>
          <Download size={16} className="mr-2" />
          Descargar Listado
        </>
      )}
    </Button>
  );
}