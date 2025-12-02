-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "organizationId" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Form" (
    "id" TEXT NOT NULL,
    "cardNo" TEXT NOT NULL,
    "salesPerson" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "country" TEXT NOT NULL,
    "cardFrontPhoto" TEXT NOT NULL,
    "cardBackPhoto" TEXT,
    "leadStatus" TEXT NOT NULL,
    "dealStatus" TEXT NOT NULL,
    "meetingAfterExhibition" BOOLEAN NOT NULL,
    "industryCategories" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "extractionStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "zohoStatus" TEXT NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExtractedData" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "name" TEXT,
    "companyName" TEXT,
    "website" TEXT,
    "email" TEXT,
    "address" TEXT,
    "contactNumbers" TEXT,
    "state" TEXT,
    "city" TEXT,
    "description" TEXT,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "ExtractedData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MergedData" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "cardNo" TEXT NOT NULL,
    "salesPerson" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "country" TEXT NOT NULL,
    "cardFrontPhoto" TEXT NOT NULL,
    "cardBackPhoto" TEXT,
    "leadStatus" TEXT NOT NULL,
    "dealStatus" TEXT NOT NULL,
    "meetingAfterExhibition" BOOLEAN NOT NULL,
    "industryCategories" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "name" TEXT,
    "companyName" TEXT,
    "website" TEXT,
    "email" TEXT,
    "address" TEXT,
    "contactNumbers" TEXT,
    "state" TEXT,
    "city" TEXT,
    "extractedCountry" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "MergedData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ExtractedData_formId_key" ON "ExtractedData"("formId");

-- CreateIndex
CREATE UNIQUE INDEX "MergedData_formId_key" ON "MergedData"("formId");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_organizationId_key" ON "Organization"("organizationId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtractedData" ADD CONSTRAINT "ExtractedData_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MergedData" ADD CONSTRAINT "MergedData_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;
