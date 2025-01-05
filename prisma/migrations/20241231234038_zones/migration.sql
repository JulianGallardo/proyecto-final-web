-- CreateTable
CREATE TABLE "Coordinates" (
    "id" TEXT NOT NULL,
    "geometryId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coordinates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Geometry" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Geometry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Zone" (
    "id" TEXT NOT NULL,
    "zoneName" TEXT NOT NULL,
    "zoneColor" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Feature',
    "geometryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Zone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Coordinates_geometryId_key" ON "Coordinates"("geometryId");

-- CreateIndex
CREATE UNIQUE INDEX "Zone_zoneName_key" ON "Zone"("zoneName");

-- CreateIndex
CREATE UNIQUE INDEX "Zone_geometryId_key" ON "Zone"("geometryId");

-- AddForeignKey
ALTER TABLE "Coordinates" ADD CONSTRAINT "Coordinates_geometryId_fkey" FOREIGN KEY ("geometryId") REFERENCES "Geometry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Zone" ADD CONSTRAINT "Zone_geometryId_fkey" FOREIGN KEY ("geometryId") REFERENCES "Geometry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
