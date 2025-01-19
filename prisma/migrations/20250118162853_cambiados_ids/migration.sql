/*
  Warnings:

  - The primary key for the `Instrumento` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `InstrumentoType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `InstrumentoType` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Juzgado` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Juzgado` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `juzgadoId` on the `Instrumento` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `instrumentoTypeId` on the `Instrumento` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Instrumento" DROP CONSTRAINT "Instrumento_instrumentoTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Instrumento" DROP CONSTRAINT "Instrumento_juzgadoId_fkey";

-- AlterTable
ALTER TABLE "Instrumento" DROP CONSTRAINT "Instrumento_pkey",
DROP COLUMN "juzgadoId",
ADD COLUMN     "juzgadoId" INTEGER NOT NULL,
DROP COLUMN "instrumentoTypeId",
ADD COLUMN     "instrumentoTypeId" INTEGER NOT NULL,
ADD CONSTRAINT "Instrumento_pkey" PRIMARY KEY ("juzgadoId", "ordenNumber");

-- AlterTable
ALTER TABLE "InstrumentoType" DROP CONSTRAINT "InstrumentoType_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "InstrumentoType_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Juzgado" DROP CONSTRAINT "Juzgado_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Juzgado_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Instrumento" ADD CONSTRAINT "Instrumento_juzgadoId_fkey" FOREIGN KEY ("juzgadoId") REFERENCES "Juzgado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Instrumento" ADD CONSTRAINT "Instrumento_instrumentoTypeId_fkey" FOREIGN KEY ("instrumentoTypeId") REFERENCES "InstrumentoType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
