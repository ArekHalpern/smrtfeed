-- AlterTable
ALTER TABLE "Document" ADD COLUMN "content" TEXT;

-- Update existing rows
UPDATE "Document" SET "content" = '';

-- Make the column required
ALTER TABLE "Document" ALTER COLUMN "content" SET NOT NULL;