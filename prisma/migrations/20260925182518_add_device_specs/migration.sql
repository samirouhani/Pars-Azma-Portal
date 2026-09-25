-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "calibrationStatus" TEXT NOT NULL DEFAULT 'CERTIFIED',
ADD COLUMN     "lastCalibrated" TIMESTAMP(3),
ADD COLUMN     "targetTemp" DOUBLE PRECISION DEFAULT 37.0;
