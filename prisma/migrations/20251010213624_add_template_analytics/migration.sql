-- CreateTable
CREATE TABLE "codeplace"."TemplateAnalytics" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "totalViews" INTEGER NOT NULL DEFAULT 0,
    "uniqueViews" INTEGER NOT NULL DEFAULT 0,
    "emailReveals" INTEGER NOT NULL DEFAULT 0,
    "phoneReveals" INTEGER NOT NULL DEFAULT 0,
    "totalDownloads" INTEGER NOT NULL DEFAULT 0,
    "averageViewTime" INTEGER,
    "lastViewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TemplateAnalytics_templateId_key" ON "codeplace"."TemplateAnalytics"("templateId");

-- CreateIndex
CREATE INDEX "TemplateAnalytics_templateId_idx" ON "codeplace"."TemplateAnalytics"("templateId");

-- AddForeignKey
ALTER TABLE "codeplace"."TemplateAnalytics" ADD CONSTRAINT "TemplateAnalytics_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "codeplace"."Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;
