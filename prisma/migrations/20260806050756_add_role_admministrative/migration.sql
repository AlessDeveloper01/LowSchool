-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'ADMINISTRATIVO');

-- CreateEnum
CREATE TYPE "CurrencyCode" AS ENUM ('MXN', 'USD', 'EUR', 'COP', 'ARS', 'BRL');

-- CreateEnum
CREATE TYPE "AppFontFamily" AS ENUM ('OUTFIT', 'INTER', 'ROBOTO', 'POPPINS', 'MONTSERRAT', 'NUNITO_SANS', 'LATO', 'DM_SANS', 'RUBIK', 'PLUS_JAKARTA_SANS', 'MERRIWEATHER', 'PLAYFAIR_DISPLAY');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(30) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'ADMINISTRATIVO',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_customization" (
    "id" VARCHAR(32) NOT NULL,
    "app_name" VARCHAR(60) NOT NULL DEFAULT 'LowSchool',
    "app_subtitle" VARCHAR(100) NOT NULL DEFAULT 'Gestión escolar',
    "primary_color" VARCHAR(7) NOT NULL DEFAULT '#5B5BD6',
    "secondary_color" VARCHAR(7) NOT NULL DEFAULT '#0786A6',
    "tertiary_color" VARCHAR(7) NOT NULL DEFAULT '#B73D9B',
    "text_color" VARCHAR(7) NOT NULL DEFAULT '#182033',
    "currency" "CurrencyCode" NOT NULL DEFAULT 'MXN',
    "font_family" "AppFontFamily" NOT NULL DEFAULT 'OUTFIT',
    "logo_url" VARCHAR(500),
    "logo_public_id" VARCHAR(255),
    "logo_dark_url" VARCHAR(500),
    "logo_dark_public_id" VARCHAR(255),
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_customization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- AddForeignKey
ALTER TABLE "app_customization" ADD CONSTRAINT "app_customization_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
