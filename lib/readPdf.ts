/* eslint-disable */
"use Server";
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/legacy/build/pdf.worker.min.mjs`

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

    // Filtrar y limpiar datos innecesarios
    const filteredData = data.map((entry) => {
        // Eliminar todo después del último guion en la carátula
        if (entry.caratula) {
            entry.caratula = entry.caratula.replace(/-.*$/, "").trim();
        }

        // Eliminar todo después de "BAHIA BLANCA" en el organismo
        if (entry.organismo) {
            entry.organismo = entry.organismo.replace(/(BAHIA BLANCA).*$/i, "$1").trim();
        }

        return entry;
    }).filter((entry) => {
        // Filtrar entradas innecesarias
        const isBlank =
            Object.values(entry).every(
                (value) =>
                    !value ||
                    value === "about:blank" ||
                    /^\d{4}-\d{2}-\d{2}$/.test(value) || // Fechas solas
                    /about:blank/i.test(value) || // Cualquier variante de "about:blank"
                    /^\d{1,2}\/\d{1,2}\/\d{2,4}, \d{1,2}:\d{2}$/.test(value) // Formato de fecha y hora (ej. 16/1/25, 19:09)
            );
        return !isBlank;
    });



    return filteredData;
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
    return pdfData;
}
