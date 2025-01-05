/*
  Warnings:

  - You are about to drop the column `geometryId` on the `Coordinates` table. All the data in the column will be lost.
  - Added the required column `geometryAssociatedId` to the `Coordinates` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Coordinates" DROP CONSTRAINT "Coordinates_geometryId_fkey";

-- DropIndex
DROP INDEX "Coordinates_geometryId_key";

-- AlterTable
ALTER TABLE "Coordinates" DROP COLUMN "geometryId",
ADD COLUMN     "geometryAssociatedId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Coordinates" ADD CONSTRAINT "Coordinates_geometryAssociatedId_fkey" FOREIGN KEY ("geometryAssociatedId") REFERENCES "Geometry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
