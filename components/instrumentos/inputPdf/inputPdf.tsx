"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, FileUp } from "lucide-react"

export default function PDFUploader() {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile)
    } else {
      setFile(null)
      alert("Por favor, selecciona un archivo PDF válido.")
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (file) {
      // Aquí puedes agregar la lógica para enviar el archivo al servidor
      console.log("Archivo seleccionado:", file.name)
      // Por ejemplo, podrías usar FormData y fetch para enviar el archivo
      // const formData = new FormData()
      // formData.append('pdf', file)
      // fetch('/api/upload', { method: 'POST', body: formData })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div>
        <Label htmlFor="pdf-upload" className="block mb-2">
          Seleccionar archivo PDF
        </Label>
        <div className="flex items-center space-x-2">
          <Input id="pdf-upload" type="file" accept=".pdf" onChange={handleFileChange} className="flex-1" />
          <Button type="submit" disabled={!file}>
            <FileUp className="mr-2 h-4 w-4" />
            Subir
          </Button>
        </div>
      </div>
      {file && (
        <div className="flex items-center text-sm text-green-600">
          <AlertCircle className="mr-2 h-4 w-4" />
          Archivo seleccionado: {file.name}
        </div>
      )}
    </form>
  )
}

