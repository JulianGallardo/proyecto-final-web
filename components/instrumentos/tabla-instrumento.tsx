"use client";

import { useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { InstrumentoExtendido } from "@/types/instrumento";
import { columns } from "./col-tabla-instrumento";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "../ui/pagination";

interface TablaInstrumentosProps {
  data: InstrumentoExtendido[]; 
  totalPages: number;
  currentPage: number;
  onEdit: (instrument: InstrumentoExtendido) => void;
  onDelete: (id: string) => void;
  openDelete: string | null;
  setOpenDelete: (id: string | null) => void;
}

export function TablaInstrumentos({ data, totalPages, currentPage, onEdit, onDelete, openDelete,setOpenDelete }: Readonly<TablaInstrumentosProps>) {




  const tableColumns = useMemo(
    () => columns({ onEdit, onDelete, openDelete, setOpenDelete }),
    [onEdit, onDelete]
  );

  const coreRowModel = useMemo(() => getCoreRowModel(), []);

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: coreRowModel,
  });

  return (
    <div>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-sm border-separate border-spacing-0">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 font-medium text-gray-700 text-center border-b border-gray-200"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-2 text-gray-600 text-center border-b border-gray-200"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

      </div>
      <Pagination className="mt-4">
        <PaginationContent className="flex space-x-2">
          {totalPages > 0 &&
            Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i + 1} className="text-sm">
                <PaginationLink
                  href={`?page=${i + 1}`}
                  className={`px-3 py-1 rounded-md border ${currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 border-gray-300 hover:bg-blue-500 hover:text-white"
                    } transition-colors duration-200`}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
        </PaginationContent>
      </Pagination> 
      <div />
    </div>
  );
}
