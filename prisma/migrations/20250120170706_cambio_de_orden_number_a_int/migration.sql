/*
  Warnings:

  - The primary key for the `Instrumento` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `ordenNumber` on the `Instrumento` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Instrumento" DROP CONSTRAINT "Instrumento_pkey",
DROP COLUMN "ordenNumber",
ADD COLUMN     "ordenNumber" INTEGER NOT NULL,
ADD CONSTRAINT "Instrumento_pkey" PRIMARY KEY ("juzgadoId", "ordenNumber");
