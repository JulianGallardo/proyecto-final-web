/*
  Warnings:

  - You are about to drop the column `deleted` on the `Instrumento` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Instrumento` table. All the data in the column will be lost.
  - You are about to drop the column `positiva` on the `Instrumento` table. All the data in the column will be lost.
  - Added the required column `agenteFullName` to the `EntregaInstrumentos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EntregaInstrumentos" DROP CONSTRAINT "EntregaInstrumentos_agenteId_fkey";

-- AlterTable
ALTER TABLE "EntregaInstrumentos" ADD COLUMN     "agenteFullName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Instrumento" DROP COLUMN "deleted",
DROP COLUMN "deletedAt",
DROP COLUMN "positiva";

-- AddForeignKey
ALTER TABLE "EntregaInstrumentos" ADD CONSTRAINT "EntregaInstrumentos_agenteId_fkey" FOREIGN KEY ("agenteId") REFERENCES "Agente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
