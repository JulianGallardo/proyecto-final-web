-- CreateEnum
CREATE TYPE "SubZona" AS ENUM ('A', 'B', 'C', 'D', 'Sin_SubZona');

-- AlterTable
ALTER TABLE "Instrumento" ADD COLUMN     "subZona" "SubZona" NOT NULL DEFAULT 'Sin_SubZona';
