-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "applicationFee" TEXT,
ADD COLUMN     "deposit" TEXT,
ADD COLUMN     "depositRefundableVisa" TEXT,
ADD COLUMN     "interviews" TEXT,
ADD COLUMN     "keyCompaniesHiring" TEXT,
ADD COLUMN     "keyJobRoles" TEXT,
ADD COLUMN     "lor" TEXT,
ADD COLUMN     "quantQualitative" TEXT,
ADD COLUMN     "sop" TEXT,
ADD COLUMN     "transcriptEvaluation" TEXT;

-- CreateTable
CREATE TABLE "Eligibility" (
    "id" SERIAL NOT NULL,
    "university" TEXT NOT NULL,
    "program" TEXT NOT NULL,
    "typeOfProgram" TEXT,
    "percentage" TEXT,
    "backlogs" TEXT,
    "workExperience" TEXT,
    "allow3YearDegree" TEXT,
    "minimumGpaOrPercentage" TEXT,
    "decisionFactor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Eligibility_pkey" PRIMARY KEY ("id")
);
