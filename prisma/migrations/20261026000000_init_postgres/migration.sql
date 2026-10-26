-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."role" AS ENUM ('ADMIN', 'USER', 'PTWC', 'AA', 'SC');

-- CreateEnum
CREATE TYPE "public"."goal_status" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."location_zone" AS ENUM ('PRC', 'UTL', 'BLD', 'GMS', 'CCR', 'OY', 'NBL', 'WS');

-- CreateEnum
CREATE TYPE "public"."work_type" AS ENUM ('COLD_WORK', 'COLD_WORK_BREAKING', 'HOT_WORK_SPARK', 'HOT_WORK_FLAME');

-- CreateEnum
CREATE TYPE "public"."risk_level" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "public"."permit_status" AS ENUM ('DRAFT', 'SUBMITTED', 'PENDING_AA_APPROVAL', 'PENDING_SC_APPROVAL', 'AA_APPROVED', 'FULLY_APPROVED', 'REJECTED_BY_AA', 'REJECTED_BY_SC', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "public"."role" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."goals" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "status" "public"."goal_status" NOT NULL DEFAULT 'PENDING',
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."permit_planning" (
    "id" SERIAL NOT NULL,
    "permit_number" VARCHAR(100),
    "work_description" TEXT NOT NULL,
    "work_location" VARCHAR(255) NOT NULL,
    "location_code" VARCHAR(10),
    "area_name" VARCHAR(100),
    "coordinates" TEXT,
    "zone" "public"."location_zone",
    "workType" "public"."work_type",
    "riskLevel" "public"."risk_level" NOT NULL DEFAULT 'LOW',
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "performing_authority" VARCHAR(255),
    "company" VARCHAR(255),
    "area_authority" VARCHAR(255),
    "site_controller_name" VARCHAR(255),
    "contractor" VARCHAR(255),
    "supervisor" VARCHAR(255),
    "ppe_required" TEXT,
    "safety_measures" TEXT,
    "emergency_contact" VARCHAR(255),
    "related_documents" TEXT,
    "status" "public"."permit_status" NOT NULL DEFAULT 'DRAFT',
    "aa_approved_by" INTEGER,
    "aa_approved_at" TIMESTAMP(3),
    "aa_comments" TEXT,
    "sc_approved_by" INTEGER,
    "sc_approved_at" TIMESTAMP(3),
    "sc_comments" TEXT,
    "rejected_by" INTEGER,
    "rejected_at" TIMESTAMP(3),
    "rejection_reason" TEXT,
    "approved_by" VARCHAR(255),
    "approved_at" TIMESTAMP(3),
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permit_planning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."organization_structure" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "position" VARCHAR(255),
    "department" VARCHAR(255),
    "parent_id" INTEGER,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organization_structure_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- AddForeignKey
ALTER TABLE "public"."goals" ADD CONSTRAINT "goals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."permit_planning" ADD CONSTRAINT "permit_planning_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."permit_planning" ADD CONSTRAINT "permit_planning_aa_approved_by_fkey" FOREIGN KEY ("aa_approved_by") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."permit_planning" ADD CONSTRAINT "permit_planning_sc_approved_by_fkey" FOREIGN KEY ("sc_approved_by") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."permit_planning" ADD CONSTRAINT "permit_planning_rejected_by_fkey" FOREIGN KEY ("rejected_by") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."organization_structure" ADD CONSTRAINT "organization_structure_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."organization_structure" ADD CONSTRAINT "organization_structure_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."organization_structure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

