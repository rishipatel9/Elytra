/*
  Warnings:

  - You are about to drop the column `studentId` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the `StudentInformation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_studentId_fkey";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "studentId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "studentId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "StudentInformation";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "password" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "phone" TEXT,
    "age" INTEGER,
    "nationality" TEXT,
    "previousDegree" TEXT,
    "grades" TEXT,
    "currentEducationLevel" TEXT,
    "preferredCountries" TEXT,
    "preferredPrograms" TEXT,
    "careerAspirations" TEXT,
    "visaQuestions" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
