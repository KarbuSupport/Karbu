-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName1" TEXT NOT NULL,
    "lastName2" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Permission" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RolePermission" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Vehicle" (
    "id" SERIAL NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "engineType" TEXT NOT NULL,
    "transmission" TEXT NOT NULL,
    "licensePlate" TEXT,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Service" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "basePrice" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contract" (
    "id" SERIAL NOT NULL,
    "clientName" TEXT NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "quoteId" INTEGER,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "qrCode" TEXT,
    "responsibleUser" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ContractService" (
    "id" SERIAL NOT NULL,
    "contractId" INTEGER NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "ContractService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" SERIAL NOT NULL,
    "contractId" INTEGER,
    "quoteId" INTEGER,
    "amount" DECIMAL(10,2) NOT NULL,
    "method" TEXT NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "voucherNumber" TEXT,
    "voucherImage" TEXT,
    "responsibleUser" INTEGER NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Quote" (
    "id" SERIAL NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "generalNotes" TEXT,
    "repairEstimate" DECIMAL(10,2),
    "purchaseCheck" BOOLEAN NOT NULL,
    "fullVisualInspection" BOOLEAN NOT NULL,
    "chassisReview" TEXT,
    "visibleDamages" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VehicleCheck" (
    "id" SERIAL NOT NULL,
    "quoteId" INTEGER NOT NULL,
    "oilLevel" TEXT,
    "temperatureLevel" TEXT,
    "fuelLevel" TEXT,
    "batteryType" TEXT,
    "batteryBrand" TEXT,
    "batteryStatus" TEXT,
    "scratches" TEXT,
    "dents" TEXT,
    "collisions" TEXT,
    "windshieldStatus" TEXT,
    "glassStatus" TEXT,
    "engineOil" TEXT,
    "transmissionOil" TEXT,
    "steeringOil" TEXT,
    "brakeFluid" TEXT,
    "wiperFluid" TEXT,
    "frontTires" TEXT,
    "frontBrakes" TEXT,
    "rearTires" TEXT,
    "rearBrakes" TEXT,
    "leakInspection" TEXT,
    "brakeSystem" TEXT,
    "engineSystem" TEXT,
    "engineCoolingSystem" TEXT,
    "transmissionCoolingSystem" TEXT,
    "shockAbsorbers" TEXT,
    "belts" TEXT,
    "hoses" TEXT,
    "airFilter" TEXT,
    "steeringMechanism" TEXT,
    "dustCoverArrows" TEXT,
    "exhaustSystem" TEXT,
    "steeringRod" TEXT,
    "suspensionBushings" TEXT,
    "bearings" TEXT,

    CONSTRAINT "VehicleCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VehicleService" (
    "id" SERIAL NOT NULL,
    "quoteId" INTEGER NOT NULL,
    "oilChange" BOOLEAN NOT NULL,
    "tuneUp" BOOLEAN NOT NULL,
    "airFilterChange" BOOLEAN NOT NULL,
    "fuelFilterChange" BOOLEAN NOT NULL,
    "throttleBodyCleaning" BOOLEAN NOT NULL,
    "iacValveCleaning" BOOLEAN NOT NULL,
    "mafSensorCleaning" BOOLEAN NOT NULL,
    "injectorCleaning" BOOLEAN NOT NULL,

    CONSTRAINT "VehicleService_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON "public"."RolePermission"("roleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_licensePlate_key" ON "public"."Vehicle"("licensePlate");

-- CreateIndex
CREATE UNIQUE INDEX "ContractService_contractId_serviceId_key" ON "public"."ContractService"("contractId", "serviceId");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "public"."Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contract" ADD CONSTRAINT "Contract_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "public"."Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contract" ADD CONSTRAINT "Contract_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "public"."Quote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contract" ADD CONSTRAINT "Contract_responsibleUser_fkey" FOREIGN KEY ("responsibleUser") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ContractService" ADD CONSTRAINT "ContractService_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."Contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ContractService" ADD CONSTRAINT "ContractService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."Contract"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "public"."Quote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_responsibleUser_fkey" FOREIGN KEY ("responsibleUser") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Quote" ADD CONSTRAINT "Quote_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "public"."Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VehicleCheck" ADD CONSTRAINT "VehicleCheck_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "public"."Quote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VehicleService" ADD CONSTRAINT "VehicleService_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "public"."Quote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
