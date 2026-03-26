-- CreateEnum
CREATE TYPE "visa_application_status" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'DOCS_REQUIRED', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "visa_applications" (
    "id" TEXT NOT NULL,
    "applicantName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "destinationCountry" TEXT NOT NULL,
    "visaType" TEXT NOT NULL,
    "travelDate" TIMESTAMP(3) NOT NULL,
    "status" "visa_application_status" NOT NULL DEFAULT 'SUBMITTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visa_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visa_application_notes" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visa_application_notes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "visa_application_notes" ADD CONSTRAINT "visa_application_notes_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "visa_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
