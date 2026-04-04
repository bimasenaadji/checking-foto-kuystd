/*
  Warnings:

  - The values [cs,op_lt1,op_lt2,op_lt3,spv] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('CREW', 'ADMIN', 'SUPERVISOR');
ALTER TABLE "public"."profiles" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "profiles" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "profiles" ALTER COLUMN "role" SET DEFAULT 'CREW';
COMMIT;

-- AlterTable
ALTER TABLE "profiles" ALTER COLUMN "role" SET DEFAULT 'CREW';
