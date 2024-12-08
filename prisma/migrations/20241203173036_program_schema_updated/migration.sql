/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Program` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Program` table. All the data in the column will be lost.
  - Added the required column `university` to the `Program` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `eligibility` on the `Program` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Program" 
ADD COLUMN     "coOpInternship" TEXT,
ADD COLUMN     "college" TEXT,
ADD COLUMN     "curriculum" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "publicPrivate" TEXT,
ADD COLUMN     "ranking" TEXT,
ADD COLUMN     "specialLocationFeatures" TEXT,
ADD COLUMN     "specialUniversityFeatures" TEXT,
ADD COLUMN     "specialization" TEXT,
ADD COLUMN     "university" TEXT NOT NULL,
ADD COLUMN     "usp" TEXT,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "mode" DROP NOT NULL,
ALTER COLUMN "duration" DROP NOT NULL,
ALTER COLUMN "category" DROP NOT NULL,
ALTER COLUMN "fees" DROP NOT NULL,
DROP COLUMN "eligibility",
ADD COLUMN     "eligibility" JSONB NOT NULL;
