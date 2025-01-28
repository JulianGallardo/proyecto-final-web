/*
  Warnings:

  - The primary key for the `Instrumento` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `address` on the `Instrumento` table. All the data in the column will be lost.
  - You are about to drop the column `entryDate` on the `Instrumento` table. All the data in the column will be lost.
  - You are about to drop the column `exitDate` on the `Instrumento` table. All the data in the column will be lost.
  - You are about to drop the column `juzgadoId` on the `Instrumento` table. All the data in the column will be lost.
  - You are about to drop the column `ordenNumber` on the `Instrumento` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ordenId]` on the table `Instrumento` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[fecha_de_ingreso,caratula]` on the table `Instrumento` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `domicilio_denunciado` to the `Instrumento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ordenId` to the `Instrumento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `positiva` to the `Instrumento` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Instrumento" DROP CONSTRAINT "Instrumento_juzgadoId_fkey";

-- DropIndex
DROP INDEX "Instrumento_juzgadoId_caratula_destinatario_key";

-- AlterTable
ALTER TABLE "Instrumento" DROP CONSTRAINT "Instrumento_pkey",
DROP COLUMN "address",
DROP COLUMN "entryDate",
DROP COLUMN "exitDate",
DROP COLUMN "juzgadoId",
DROP COLUMN "ordenNumber",
ADD COLUMN     "domicilio_denunciado" TEXT NOT NULL,
ADD COLUMN     "fecha_de_ingreso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fecha_de_salida" TIMESTAMP(3),
ADD COLUMN     "instrumentoId" SERIAL NOT NULL,
ADD COLUMN     "ordenId" INTEGER NOT NULL,
ADD COLUMN     "positiva" BOOLEAN NOT NULL,
ADD CONSTRAINT "Instrumento_pkey" PRIMARY KEY ("instrumentoId", "ordenId");

-- CreateTable
CREATE TABLE "Orden" (
    "id" SERIAL NOT NULL,
    "ordenNumber" INTEGER NOT NULL,
    "juzgadoId" INTEGER NOT NULL,
    "instrumentoId" INTEGER NOT NULL,

    CONSTRAINT "Orden_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Instrumento_ordenId_key" ON "Instrumento"("ordenId");

-- CreateIndex
CREATE UNIQUE INDEX "Instrumento_fecha_de_ingreso_caratula_key" ON "Instrumento"("fecha_de_ingreso", "caratula");

-- AddForeignKey
ALTER TABLE "Orden" ADD CONSTRAINT "Orden_juzgadoId_fkey" FOREIGN KEY ("juzgadoId") REFERENCES "Juzgado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Instrumento" ADD CONSTRAINT "Instrumento_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "Orden"("id") ON DELETE CASCADE ON UPDATE CASCADE;
