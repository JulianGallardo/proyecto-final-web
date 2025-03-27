import { NextRequest, NextResponse } from "next/server";
import XLSX from "xlsx-js-style"
import { getInstrumentosByAgent } from "@/actions/instrumentos-actions";
import { getAgenteById } from "@/actions/user-actions";

export async function GET(request: NextRequest) {
    try {
        // Extract and clean search parameters
        const searchParams = Object.fromEntries(request.nextUrl.searchParams);
        const agenteId = Number(searchParams.agenteId);
        const fechaDesde = searchParams.desde;
        delete searchParams.agenteId;
        delete searchParams.desde;
        delete searchParams.hasta;

        // Fetch instruments and agent data
        const instrumentos = await getInstrumentosByAgent(searchParams, agenteId);
        const agente = await getAgenteById(agenteId);

        // Prepare worksheet data
        const worksheetData = prepareWorksheetData(instrumentos);

        // Create workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet([]);
        
        // Configure column widths
        worksheet['!cols'] = configureColumnWidths();

        // Add header metadata
        addHeaderMetadata(worksheet, agente, instrumentos, fechaDesde);

        // Add data to worksheet
        XLSX.utils.sheet_add_json(worksheet, worksheetData, { origin: 'A7', skipHeader: false });
        
        // Update worksheet reference range
        const range = XLSX.utils.decode_range(worksheet['!ref'] ?? 'A1');
        worksheet['!ref'] = XLSX.utils.encode_range({
            s: { r: 0, c: range.s.c },
            e: { r: range.e.r, c: range.e.c }
        });
        
        // Create and apply styles
        const { baseStyle, headerStyle } = createStyleObjects();
        applyWorksheetStyles(worksheet, range, headerStyle, baseStyle);

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Instrumentos');

        // Generate Excel buffer
        const excelBuffer = XLSX.write(workbook, { 
            type: 'buffer', 
            bookType: 'xlsx', 
            bookSST: false, 
            cellStyles: true 
        });

        // Generate filename
        let filename = `${agente.user.name} ${agente.user.lastname}-${fechaDesde || 'sinFecha'}`;

        // Return Excel file
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

// Utility function to format dates consistently
function formatDate(dateInput: Date | string | null | undefined): string {
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
}

// Function to prepare worksheet data from instruments
function prepareWorksheetData(instrumentos: any[]) {
    return instrumentos.map(instrumento => ({
        "Número de orden": instrumento.orden.ordenNumber,
        "Juzgado": instrumento.orden.juzgado.identifier,
        "Carátula": instrumento.caratula,
        "Tipo de instrumento": instrumento.instrumentoType.name,
        "Domicilio": instrumento.domicilio_denunciado,
        "Fecha de salida": formatDate(instrumento.fecha_de_salida),
        "Observaciones": instrumento.observaciones ?? "",
    }));
}

// Function to configure column widths
function configureColumnWidths() {
    return [
        { wch: 15 },   // Número de orden
        { wch: 20 },   // Juzgado
        { wch: 100 },  // Carátula
        { wch: 20 },   // Tipo
        { wch: 30 },   // Domicilio
        { wch: 20 },   // Fecha de salida
        { wch: 30 },   // Observaciones
    ];
}

// Function to add header metadata to the worksheet
function addHeaderMetadata(
    worksheet: any, 
    agente: any, 
    instrumentos: any[], 
    fechaDesde: string | undefined
) {
    const fechaText = fechaDesde ? formatDate(fechaDesde) : '';
    const totalText = `${instrumentos.length}`;
    const agenteText = `${agente.user.name} ${agente.user.lastname}`;
    const dateGenerated = `Generado el: ${formatDate(new Date())}`;
    const placeText = "BAHIA BLANCA";
    
    // Add various header rows
    XLSX.utils.sheet_add_aoa(worksheet, [
        ["OFICINA"],
        ["OFICIAL"],
        ["INGRESOS DEL DIA"],
        ["FECHA"],
        [dateGenerated]
    ], { origin: 'B1' });
    
    XLSX.utils.sheet_add_aoa(worksheet, [
        [placeText],
        [agenteText],
        [totalText],
        [fechaText]
    ], { origin: 'C1' });

    XLSX.utils.sheet_add_aoa(worksheet, [
        ["TOTAL EN PODER"],
        ["ENTREGADAS"],
        ["FOLIO"],
    ], { origin: 'F1' });
    
    XLSX.utils.sheet_add_aoa(worksheet, [
        [""],
        [""],
        [""],
    ], { origin: 'G1' });
}

// Function to create style objects
function createStyleObjects() {
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
    
    const headerStyle = {
        font: { bold: true, sz: 11 },
        fill: { 
            fgColor: { rgb: "DDDDDD" },
            patternType: 'solid'
        },
        border: {
            top: { style: 'medium', color: { rgb: "000000" } },
            bottom: { style: 'medium', color: { rgb: "000000" } },
            left: { style: 'medium', color: { rgb: "000000" } },
            right: { style: 'medium', color: { rgb: "000000" } }
        },
        alignment: { horizontal: 'center', vertical: 'center', wrapText: true }
    };

    return { baseStyle, headerStyle };
}

// Function to apply styles to the worksheet
function applyStyleToCell(worksheet: any, row: number, col: number, style: any) {
    const cell = XLSX.utils.encode_cell({ r: row, c: col });
    if (worksheet[cell]) {
        worksheet[cell].s = style;
    }
}

function applyStyleToTitleRows(worksheet: any, baseStyle: any) {
    // Style for title rows in columns 1-2
    for (let i = 0; i < 5; i++) {
        for (let j = 1; j < 3; j++) {
            applyStyleToCell(worksheet, i, j, baseStyle);
        }
    }

    // Style for title rows in columns 5-6
    for (let i = 0; i < 3; i++) {
        for (let j = 5; j < 7; j++) {
            applyStyleToCell(worksheet, i, j, baseStyle);
        }
    }
}

function applyStyleToHeaderRow(worksheet: any, range: any, headerStyle: any) {
    const headerRow = 6;
    for (let col = 0; col <= range.e.c; col++) {
        applyStyleToCell(worksheet, headerRow, col, headerStyle);
    }
}

function applyStyleToDataRows(worksheet: any, range: any, baseStyle: any) {
    const headerRow = 6;
    for (let row = headerRow + 1; row <= range.e.r; row++) {
        for (let col = 0; col <= range.e.c; col++) {
            applyStyleToCell(worksheet, row, col, baseStyle);
        }
    }
}

function applyWorksheetStyles(worksheet: any, range: any, headerStyle: any, baseStyle: any) {
    // Apply title row styles
    applyStyleToTitleRows(worksheet, baseStyle);

    // Apply header row styles
    applyStyleToHeaderRow(worksheet, range, headerStyle);
    
    // Apply data rows styles
    applyStyleToDataRows(worksheet, range, baseStyle);
}

