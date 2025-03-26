import { NextRequest, NextResponse } from "next/server";
import * as XLSX from 'xlsx';
import { getInstrumentosByAgent } from "@/actions/instrumentos-actions";
import { getAgenteById } from "@/actions/user-actions";

export async function GET(request: NextRequest) {
    try {
        const searchParams = Object.fromEntries(request.nextUrl.searchParams);
        const agenteId = Number(searchParams.agenteId);
        const fechaDesde = searchParams.desde;
        const fechaHasta = searchParams.hasta;
        delete searchParams.agenteId;
        delete searchParams.desde;
        delete searchParams.hasta;

        // Get all instruments for the agent (not paginated)
        const instrumentos = await getInstrumentosByAgent(searchParams, agenteId);
        const agente = await getAgenteById(agenteId);

        // Format dates for better display
        const formatDate = (dateInput: Date | string | null | undefined) => {
            if (!dateInput) return '';
            
            let date: Date;
            if (dateInput instanceof Date) {
                date = dateInput;
            } else {
                // Create date from string
                date = new Date(dateInput);
                // Add one day to fix the timezone offset issue
                date.setDate(date.getDate() + 1);
            }
            
            return date.toLocaleDateString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit' });
        };

        // Format the data for Excel with better presentation
        const worksheetData = instrumentos.map(instrumento => ({
            "Número de orden": instrumento.orden.ordenNumber,
            "Juzgado": instrumento.orden.juzgado.identifier,
            "Carátula": instrumento.caratula,
            "Tipo de instrumento": instrumento.instrumentoType.name,
            "Domicilio denunciado": instrumento.domicilio_denunciado,
            "Fecha de salida": formatDate(instrumento.fecha_de_salida),
            "Observaciones": instrumento.observaciones ?? "",
        }));

        // Create workbook
        const workbook = XLSX.utils.book_new();
        
        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet([]);
        
        // Configurar anchos de columna
        const cols = [
            { wch: 15 },  // Número de orden
            { wch: 20 },  // Juzgado
            { wch: 40 },  // Carátula
            { wch: 20 },  // Tipo
            { wch: 30 },  // Domicilio
            { wch: 20 },  // Fecha de salida
            { wch: 20 },  // Estado
            { wch: 30 },  // Observaciones
        ];
        worksheet['!cols'] = cols;

        // Crear el título y metadatos en la parte superior
        const desdeText = fechaDesde ?  formatDate(fechaDesde) : '';
        const titleText = `REPORTE DE INGRESOS ${desdeText}`;
        const totalText = `Total de instrumentos: ${instrumentos.length}`;
        const agenteText = `Agente: ${agente.user.name} ${agente.user.lastname} (${agente.user.email})`;
        const dateGenerated = `Generado el: ${formatDate(new Date())}`;
        
        XLSX.utils.sheet_add_aoa(worksheet, [
            [titleText],
            [totalText],
            [agenteText],
            [''],
            [dateGenerated],
            ['']  // Fila vacía como separador
        ], { origin: 'A1' });
        
        // Agregar los datos a partir de la fila 7
        XLSX.utils.sheet_add_json(worksheet, worksheetData, { origin: 'A7', skipHeader: false });
        
        // Actualizar el rango de referencia
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
        worksheet['!ref'] = XLSX.utils.encode_range({
            s: { r: 0, c: range.s.c },
            e: { r: range.e.r, c: range.e.c }
        });
        
        // Estilo base mejorado para todas las celdas (BORDES NEGROS Y GRUESOS)
        const baseStyle = {
            font: { sz: 11 },
            border: {
                top: { style: 'medium', color: { rgb: "000000" } },
                bottom: { style: 'medium', color: { rgb: "000000" } },
                left: { style: 'medium', color: { rgb: "000000" } },
                right: { style: 'medium', color: { rgb: "000000" } }
            },
            alignment: { horizontal: 'center', vertical: 'center', wrapText: true }
        };
        
        // Estilo para título y total (más grande y en negrita)
        const titleStyle = {
            font: { bold: true, sz: 14 },
            alignment: { horizontal: 'center', vertical: 'center' },
            border: {
                top: { style: 'medium', color: { rgb: "000000" } },
                bottom: { style: 'medium', color: { rgb: "000000" } },
                left: { style: 'medium', color: { rgb: "000000" } },
                right: { style: 'medium', color: { rgb: "000000" } }
            }
        };
        
        const headerStyle = {
            font: { bold: true, sz: 11 },
            fill: { fgColor: { rgb: "DDDDDD" } },
            border: {
                top: { style: 'medium', color: { rgb: "000000" } },
                bottom: { style: 'medium', color: { rgb: "000000" } },
                left: { style: 'medium', color: { rgb: "000000" } },
                right: { style: 'medium', color: { rgb: "000000" } }
            },
            alignment: { horizontal: 'center', vertical: 'center', wrapText: true }
        };
        
        // Aplicar estilo al título
        const titleCellA1 = XLSX.utils.encode_cell({ r: 0, c: 0 });
        worksheet[titleCellA1].s = titleStyle;
        
        // Aplicar estilo al total
        const totalCellA2 = XLSX.utils.encode_cell({ r: 1, c: 0 });
        worksheet[totalCellA2].s = titleStyle;
        
        // Aplicar estilo al agente
        const agenteCellA3 = XLSX.utils.encode_cell({ r: 2, c: 0 });
        worksheet[agenteCellA3].s = baseStyle;
        
        // Aplicar estilo a la fecha de generación
        const dateCellA5 = XLSX.utils.encode_cell({ r: 4, c: 0 });
        worksheet[dateCellA5].s = baseStyle;
        
        // Aplicar estilo a los encabezados de las columnas
        const headerRow = 6; // Fila de encabezados
        for (let C = 0; C <= range.e.c; ++C) {
            const address = XLSX.utils.encode_cell({ r: headerRow, c: C });
            if (worksheet[address]) {
                worksheet[address].s = headerStyle;
            }
        }
        
        // Aplicar estilo a todas las celdas de datos con bordes negros gruesos
        for (let R = headerRow + 1; R <= range.e.r; ++R) {
            for (let C = 0; C <= range.e.c; ++C) {
                const address = XLSX.utils.encode_cell({ r: R, c: C });
                if (worksheet[address]) {
                    worksheet[address].s = baseStyle;
                }
            }
        }
        
        // Fusionar celdas para el título, total y fecha
        worksheet['!merges'] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }, // Título en toda la anchura
            { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } }, // Total en toda la anchura
            { s: { r: 2, c: 0 }, e: { r: 2, c: 7 } }, // Agente en toda la anchura
            { s: { r: 4, c: 0 }, e: { r: 4, c: 7 } }, // Fecha en toda la anchura
        ];
        
        // Agregar hoja al libro
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Instrumentos');

        // Convertir a buffer
        const excelBuffer = XLSX.write(workbook, { 
            type: 'buffer', 
            bookType: 'xlsx', 
            bookSST: false, 
            cellStyles: true 
        });

        // Generate filename with date range if available
        let filename = `${agente.user.name} ${agente.user.lastname}-${fechaDesde}`;
        

        // Devolver el archivo Excel
        return new NextResponse(excelBuffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename=${filename}.xlsx`
            }
        });
    } catch (error) {
        console.error('Error generando el archivo Excel:', error);
        return NextResponse.json(
            { error: 'Error generando el archivo Excel' },
            { status: 500 }
        );
    }
}