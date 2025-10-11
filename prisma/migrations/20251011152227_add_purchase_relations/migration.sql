-- AddForeignKey
ALTER TABLE "codeplace"."Purchase" ADD CONSTRAINT "Purchase_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "codeplace"."Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "codeplace"."Purchase" ADD CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "codeplace"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
