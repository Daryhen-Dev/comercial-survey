-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "TipoPregunta" AS ENUM ('CHECKBOX', 'RADIO', 'BOTH');

-- CreateTable
CREATE TABLE "User" (
    "Id" SERIAL NOT NULL,
    "Email" TEXT NOT NULL,
    "PasswordHash" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Sucursal" (
    "Id" SERIAL NOT NULL,
    "Nombre" VARCHAR(150) NOT NULL,
    "Direccion" VARCHAR(300),
    "Activa" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sucursal_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Empleado" (
    "Id" SERIAL NOT NULL,
    "CI" VARCHAR(20) NOT NULL,
    "Nombre" VARCHAR(100) NOT NULL,
    "Apellido" VARCHAR(100) NOT NULL,
    "Estado" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Empleado_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "EmpleadoSucursal" (
    "Id" SERIAL NOT NULL,
    "Empleado_Id" INTEGER NOT NULL,
    "Sucursal_Id" INTEGER NOT NULL,
    "Estado" BOOLEAN NOT NULL DEFAULT true,
    "FechaInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaFin" TIMESTAMP(3),

    CONSTRAINT "EmpleadoSucursal_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Encuesta" (
    "Id" SERIAL NOT NULL,
    "Titulo" VARCHAR(200) NOT NULL,
    "Descripcion" TEXT,
    "Activa" BOOLEAN NOT NULL DEFAULT true,
    "Sucursal_Id" INTEGER NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Encuesta_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Pregunta" (
    "Id" SERIAL NOT NULL,
    "Texto" VARCHAR(500) NOT NULL,
    "Tipo" "TipoPregunta" NOT NULL DEFAULT 'RADIO',
    "Orden" INTEGER NOT NULL DEFAULT 0,
    "Requerida" BOOLEAN NOT NULL DEFAULT true,
    "Encuesta_Id" INTEGER NOT NULL,

    CONSTRAINT "Pregunta_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Opcion" (
    "Id" SERIAL NOT NULL,
    "Texto" VARCHAR(300) NOT NULL,
    "Orden" INTEGER NOT NULL DEFAULT 0,
    "Pregunta_Id" INTEGER NOT NULL,

    CONSTRAINT "Opcion_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Participacion" (
    "Id" SERIAL NOT NULL,
    "EmpleadoSucursal_Id" INTEGER NOT NULL,
    "Encuesta_Id" INTEGER NOT NULL,
    "Observacion" TEXT,
    "DateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Participacion_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Respuesta" (
    "Id" SERIAL NOT NULL,
    "Participacion_Id" INTEGER NOT NULL,
    "Pregunta_Id" INTEGER NOT NULL,
    "Opcion_Id" INTEGER NOT NULL,

    CONSTRAINT "Respuesta_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Empleado_CI_key" ON "Empleado"("CI");

-- Partial unique index: only one active assignment per employee
-- (replaces the full unique index Prisma would generate from @@unique([Empleado_Id]))
CREATE UNIQUE INDEX "uq_empleado_activo" ON "EmpleadoSucursal"("Empleado_Id") WHERE "Estado" = true;

-- CreateIndex
CREATE UNIQUE INDEX "Participacion_EmpleadoSucursal_Id_Encuesta_Id_key" ON "Participacion"("EmpleadoSucursal_Id", "Encuesta_Id");

-- AddForeignKey
ALTER TABLE "EmpleadoSucursal" ADD CONSTRAINT "EmpleadoSucursal_Empleado_Id_fkey" FOREIGN KEY ("Empleado_Id") REFERENCES "Empleado"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmpleadoSucursal" ADD CONSTRAINT "EmpleadoSucursal_Sucursal_Id_fkey" FOREIGN KEY ("Sucursal_Id") REFERENCES "Sucursal"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encuesta" ADD CONSTRAINT "Encuesta_Sucursal_Id_fkey" FOREIGN KEY ("Sucursal_Id") REFERENCES "Sucursal"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pregunta" ADD CONSTRAINT "Pregunta_Encuesta_Id_fkey" FOREIGN KEY ("Encuesta_Id") REFERENCES "Encuesta"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opcion" ADD CONSTRAINT "Opcion_Pregunta_Id_fkey" FOREIGN KEY ("Pregunta_Id") REFERENCES "Pregunta"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participacion" ADD CONSTRAINT "Participacion_EmpleadoSucursal_Id_fkey" FOREIGN KEY ("EmpleadoSucursal_Id") REFERENCES "EmpleadoSucursal"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participacion" ADD CONSTRAINT "Participacion_Encuesta_Id_fkey" FOREIGN KEY ("Encuesta_Id") REFERENCES "Encuesta"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Respuesta" ADD CONSTRAINT "Respuesta_Participacion_Id_fkey" FOREIGN KEY ("Participacion_Id") REFERENCES "Participacion"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Respuesta" ADD CONSTRAINT "Respuesta_Pregunta_Id_fkey" FOREIGN KEY ("Pregunta_Id") REFERENCES "Pregunta"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Respuesta" ADD CONSTRAINT "Respuesta_Opcion_Id_fkey" FOREIGN KEY ("Opcion_Id") REFERENCES "Opcion"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
