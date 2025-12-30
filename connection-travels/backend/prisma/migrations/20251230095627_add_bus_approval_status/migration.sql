-- CreateEnum
CREATE TYPE "BusApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Bus" ADD COLUMN     "approvalNote" TEXT,
ADD COLUMN     "approvalStatus" "BusApprovalStatus" NOT NULL DEFAULT 'PENDING';
