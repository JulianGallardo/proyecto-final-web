/*
  Warnings:

  - The primary key for the `Instrumento` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `cargaInstrumento` to the `Instrumento` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoCarga" AS ENUM ('PDF', 'MAN');

-- AlterTable
ALTER TABLE "Instrumento" DROP CONSTRAINT "Instrumento_pkey",
ADD COLUMN     "cargaInstrumento" "TipoCarga" NOT NULL,
ADD CONSTRAINT "Instrumento_pkey" PRIMARY KEY ("cargaInstrumento", "codigoInstrumento", "ordenId");
