import fs from "fs";
// Importar la versión 'legacy' de pdfjs-dist para Node.js
import * as pdfjsLib from "pdfjs-dist";

// Ruta del archivo PDF
const pdfPath = "./pdfInstrumentos.pdf";

// Función para procesar cada bloque de texto y extraer campos clave
function parseTextToJson(text: string): object[] {
    const entries = text.split(/Organismo:/).slice(1);

    const data = entries.map((entry) => {
        const organismoMatch = entry.match(/^(.*?)(\n|Carátula:)/)?.[1]?.trim();
        const caratulaMatch = entry.match(/Carátula:\s+(.*?)(\n|Número:)/)?.[1]?.trim();
        const numeroMatch = entry.match(/Número:\s+(\d+)/)?.[1]?.trim();
        const destinatarioMatch = entry.match(/Destinatario:\s+(.*?)(\n|Domicilio:)/)?.[1]?.trim();
        const domicilioMatch = entry.match(/Domicilio:\s+(.*?)(\n|Destinatario Postal:)/)?.[1]?.trim();
        const destinatarioPostalMatch = entry.match(/Destinatario Postal:\s+(.*?)(\n|Alta o Disponibilidad:)/)?.[1]?.trim();
        const altaDisponibilidadMatch = entry.match(/Alta o Disponibilidad:\s+(.*?)(\n|Notificación:)/)?.[1]?.trim();
        const notificacionMatch = entry.match(/Notificación:\s+(.*?)(\n|Trámite:)/)?.[1]?.trim();
        const tramiteMatch = entry.match(/Trámite:\s+(.*?)(\n|Código:)/)?.[1]?.trim();
        const codigoMatch = entry.match(/Código:\s+([A-Z0-9]+)/)?.[1]?.trim();
        const estadoMatch = entry.match(/Procesada|Pendiente/)?.[0]?.trim();

        return {
            organismo: organismoMatch || "",
            caratula: caratulaMatch || "",
            numero: numeroMatch || "",
            destinatario: destinatarioMatch || "",
            domicilio: domicilioMatch || "",
            destinatarioPostal: destinatarioPostalMatch || "",
            altaDisponibilidad: altaDisponibilidadMatch || "",
            notificacion: notificacionMatch || "",
            tramite: tramiteMatch || "",
            codigo: codigoMatch || "",
            estado: estadoMatch || "",
        };
    });

    return data;
}

async function extractTextFromPDF(pdfPath: string) {
    // Leer el archivo como un buffer y convertirlo a Uint8Array
    const pdfBuffer = fs.readFileSync(pdfPath);
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

extractTextFromPDF(pdfPath).then((text) => {
    const jsonData = parseTextToJson(text);

    // Guardar el JSON en un archivo
    fs.writeFileSync("datosExtraidos.json", JSON.stringify(jsonData, null, 2));

    console.log("Datos extraídos y guardados en datosExtraidos.json");
}).catch((error) => {
    console.error("Error extrayendo texto:", error);
});
