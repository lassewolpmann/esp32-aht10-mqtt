-- CreateTable
CREATE TABLE "TempHumidityData" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "temp" DOUBLE PRECISION NOT NULL,
    "humidity" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TempHumidityData_pkey" PRIMARY KEY ("id")
);
