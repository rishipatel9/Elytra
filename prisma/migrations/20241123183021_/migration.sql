-- CreateTable
CREATE TABLE "StudentInformation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "nationality" TEXT NOT NULL,
    "previousDegree" TEXT NOT NULL,
    "grades" TEXT NOT NULL,
    "currentEducationLevel" TEXT NOT NULL,
    "preferredCountries" TEXT NOT NULL,
    "preferredPrograms" TEXT NOT NULL,
    "careerAspirations" TEXT NOT NULL,
    "visaQuestions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "image" TEXT,

    CONSTRAINT "StudentInformation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentInformation_email_key" ON "StudentInformation"("email");
