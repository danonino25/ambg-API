/*
  Warnings:

  - You are about to drop the column `hash` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "Logs" ADD COLUMN     "action" TEXT,
ADD COLUMN     "description" TEXT,
ALTER COLUMN "statusCode" DROP NOT NULL,
ALTER COLUMN "timestamp" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "path" DROP NOT NULL,
ALTER COLUMN "error" DROP NOT NULL,
ALTER COLUMN "errorCode" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "hash",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
