/*
  Warnings:

  - The primary key for the `Instrumento` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `instrumentoId` on the `Instrumento` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[codigoInstrumento]` on the table `Instrumento` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codigoInstrumento` to the `Instrumento` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EntregaInstrumentos" DROP CONSTRAINT "EntregaInstrumentos_instrumentoId_fkey";

-- DropIndex
DROP INDEX "Instrumento_fecha_de_ingreso_caratula_key";

-- DropIndex
DROP INDEX "Instrumento_instrumentoId_key";

-- AlterTable
ALTER TABLE "EntregaInstrumentos" ALTER COLUMN "instrumentoId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Instrumento" DROP CONSTRAINT "Instrumento_pkey",
DROP COLUMN "instrumentoId",
ADD COLUMN     "codigoInstrumento" TEXT NOT NULL,
ADD COLUMN     "observaciones" TEXT,
ADD CONSTRAINT "Instrumento_pkey" PRIMARY KEY ("codigoInstrumento", "ordenId");

-- CreateIndex
CREATE UNIQUE INDEX "Instrumento_codigoInstrumento_key" ON "Instrumento"("codigoInstrumento");

-- AddForeignKey
ALTER TABLE "EntregaInstrumentos" ADD CONSTRAINT "EntregaInstrumentos_instrumentoId_fkey" FOREIGN KEY ("instrumentoId") REFERENCES "Instrumento"("codigoInstrumento") ON DELETE CASCADE ON UPDATE CASCADE;
