"use client";

import { Button } from "../ui/button";
import SearchParamsInstrumentos from "@/types/searchParams";

interface DescargarExcelButtonProps {
  searchParams: SearchParamsInstrumentos;
  agenteId: number;
}

export default function DescargarExcelButton({ searchParams, agenteId }: Readonly<DescargarExcelButtonProps>) {
  const handleDownload = async () => {
    try {
      const url = new URLSearchParams({ ...searchParams as any, agenteId: agenteId.toString() }).toString();
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
      link.download = `instrumentos-agente-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading Excel file:', error);
      alert('Error al descargar el archivo Excel');
    }
  };

  return (
    <Button 
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-fit"
      onClick={handleDownload}
    >
      Descargar Excel
    </Button>
  );
}
