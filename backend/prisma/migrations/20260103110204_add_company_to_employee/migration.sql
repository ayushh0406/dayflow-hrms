/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `companies` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyId` to the `employees` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Add companyId column as nullable first
ALTER TABLE "employees" ADD COLUMN "companyId" TEXT;

-- Step 2: Get the first company (or create one if none exists)
DO $$
DECLARE
  default_company_id TEXT;
BEGIN
  -- Get the first company ID
  SELECT id INTO default_company_id FROM "companies" LIMIT 1;
  
  -- If no company exists, create a default one
  IF default_company_id IS NULL THEN
    INSERT INTO "companies" (id, name, "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), 'Default Company', NOW(), NOW())
    RETURNING id INTO default_company_id;
  END IF;
  
  -- Update all existing employees with the company ID
  UPDATE "employees" SET "companyId" = default_company_id WHERE "companyId" IS NULL;
END $$;

-- Step 3: Make companyId NOT NULL
ALTER TABLE "employees" ALTER COLUMN "companyId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "companies_name_key" ON "companies"("name");

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
