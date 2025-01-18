-- CreateTable
CREATE TABLE "Juzgado" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,

    CONSTRAINT "Juzgado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstrumentoType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,

    CONSTRAINT "InstrumentoType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instrumento" (
    "entryDate" TIMESTAMP(3) NOT NULL,
    "exitDate" TIMESTAMP(3) NOT NULL,
    "caratula" TEXT NOT NULL,
    "destinatario" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "ordenNumber" TEXT NOT NULL,
    "juzgadoId" TEXT NOT NULL,
    "instrumentoTypeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Instrumento_pkey" PRIMARY KEY ("juzgadoId","ordenNumber")
);

-- CreateIndex
CREATE UNIQUE INDEX "Juzgado_identifier_key" ON "Juzgado"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "InstrumentoType_identifier_key" ON "InstrumentoType"("identifier");

-- AddForeignKey
ALTER TABLE "Instrumento" ADD CONSTRAINT "Instrumento_juzgadoId_fkey" FOREIGN KEY ("juzgadoId") REFERENCES "Juzgado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Instrumento" ADD CONSTRAINT "Instrumento_instrumentoTypeId_fkey" FOREIGN KEY ("instrumentoTypeId") REFERENCES "InstrumentoType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
