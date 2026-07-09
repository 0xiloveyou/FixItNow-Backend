-- AlterTable
ALTER TABLE "technician_profiles" ADD COLUMN     "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "completedJobs" INTEGER NOT NULL DEFAULT 0;
