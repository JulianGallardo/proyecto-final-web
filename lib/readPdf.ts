"use Server";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker";

// Función para procesar cada bloque de texto y extraer campos clave
function parseTextToJson(text: string): object[] {
    const entries = text.split(/Organismo:/).slice(1);

    const data = entries.map((entry) => {
        const organismoMatch = RegExp(/^(.*?)(?:\n|Carátula:)/).exec(entry)?.[1]?.trim();
        let caratulaMatch = RegExp(/Carátula:\s+([^]*?)(?:\n|Número:)/).exec(entry)?.[1]?.trim();
        const numeroMatch = RegExp(/Número:\s+(\d+)/).exec(entry)?.[1]?.trim();
        const destinatarioMatch = RegExp(/Destinatario:\s+([^]*?)(?:\n|Domicilio:)/).exec(entry)?.[1]?.trim();
        const domicilioMatch = RegExp(/Domicilio:\s+([^]*?)(?:\n|Destinatario Postal:)/).exec(entry)?.[1]?.trim();
        const destinatarioPostalMatch = RegExp(/Destinatario Postal:\s+([^]*?)(?:\n|Alta o Disponibilidad:)/).exec(entry)?.[1]?.trim();
        const altaDisponibilidadMatch = RegExp(/Alta o Disponibilidad:\s+([^]*?)(?:\n|Notificación:)/).exec(entry)?.[1]?.trim();
        const notificacionMatch = RegExp(/Notificación:\s+([^]*?)(?:\n|Trámite:)/).exec(entry)?.[1]?.trim();
        const tramiteMatch = RegExp(/Trámite:\s+([^]*?)(?:\n|Código:)/).exec(entry)?.[1]?.trim();
        const codigoMatch = RegExp(/Código:\s+([A-Z0-9]+)/).exec(entry)?.[1]?.trim();
        const estadoMatch = RegExp(/(?:Procesada|Pendiente)/).exec(entry)?.[0]?.trim();

        // Eliminar guion final en carátula si existe
        if (caratulaMatch) {
            caratulaMatch = caratulaMatch.replace(/[-\s]+$/, "");
        }

        return {
            organismo: organismoMatch ?? "",
            caratula: caratulaMatch ?? "",
            numero: numeroMatch ?? "",
            destinatario: destinatarioMatch ?? "",
            domicilio: domicilioMatch ?? "",
            destinatarioPostal: destinatarioPostalMatch ?? "",
            altaDisponibilidad: altaDisponibilidadMatch ?? "",
            notificacion: notificacionMatch ?? "",
            tramite: tramiteMatch ?? "",
            codigo: codigoMatch ?? "",
            estado: estadoMatch ?? "",
        };
    });

    // Filtrar datos innecesarios
    const filteredData = data.filter((entry) => {
        const isBlank =
            Object.values(entry).every(
                (value) => !value || value === "about:blank" || /^\d{4}-\d{2}-\d{2}$/.test(value)
            );
        return !isBlank;
    });

    // Eliminar duplicados basándose en un identificador único, como 'codigo' o 'caratula'
    const uniqueData = Array.from(
        new Map(filteredData.map((item) => [ item.caratula, item])).values()
    );

    return uniqueData;
}

async function extractTextFromPDF(File: File) {
    // Leer el archivo como un buffer y convertirlo a Uint8Array
    const pdfBuffer = await File.arrayBuffer();
    const pdfData = new Uint8Array(pdfBuffer);

    // Usar el build 'legacy' para cargar el documento PDF
    const pdfDoc = await pdfjsLib.getDocument({ data: pdfData }).promise;

    let fullText = "";

    for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(" ");
        fullText += `\n${pageText}\n`;
    }

    return fullText;
}

export async function extractTextFromPDFAndParse(File: File) {
    const pdfText = await extractTextFromPDF(File);
    const pdfData = parseTextToJson(pdfText);
    console.log("Data",pdfData);
    return pdfData;
}
