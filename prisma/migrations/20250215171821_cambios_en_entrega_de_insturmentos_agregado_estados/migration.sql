/*
  Warnings:

  - You are about to drop the column `createdAt` on the `EntregaInstrumentos` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "EstadoEntrega" AS ENUM ('PENDIENTE_DE_PROCESAR', 'ENTREGADO', 'NO_ENTREGADO');

-- AlterTable
ALTER TABLE "EntregaInstrumentos" DROP COLUMN "createdAt",
ADD COLUMN     "estado" "EstadoEntrega" NOT NULL DEFAULT 'PENDIENTE_DE_PROCESAR',
ADD COLUMN     "fecha_entrega" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "observaciones" TEXT;
