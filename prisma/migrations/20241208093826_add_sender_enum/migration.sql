/*
  Warnings:

  - Changed the type of `sender` on the `Chat` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SenderType" AS ENUM ('AI', 'USER');

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "sender",
ADD COLUMN     "sender" "SenderType" NOT NULL;

-- AlterTable
ALTER TABLE "Program" ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
