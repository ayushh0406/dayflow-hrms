-- AlterTable
ALTER TABLE "payroll" ADD COLUMN     "fixedAllowance" DOUBLE PRECISION,
ADD COLUMN     "leaveTravelAllowance" DOUBLE PRECISION,
ADD COLUMN     "performanceBonus" DOUBLE PRECISION,
ADD COLUMN     "professionalTax" DOUBLE PRECISION,
ADD COLUMN     "standardAllowance" DOUBLE PRECISION;
