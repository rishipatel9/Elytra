/*
  Warnings:

  - You are about to drop the column `catageory` on the `Program` table. All the data in the column will be lost.
  - Added the required column `category` to the `Program` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Program" DROP COLUMN "catageory",
ADD COLUMN     "category" TEXT NOT NULL;
