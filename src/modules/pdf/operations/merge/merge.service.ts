import { PDFDocument } from "pdf-lib";
import * as fs from "fs"; 


export class MergeService {
async merge(files: string[]):Promise<Buffer> {
         // create a pdf document
         const pdf = await PDFDocument.create();
         for(const file of files) {
              const buffer = fs.readFileSync(file);
              const src = await PDFDocument.load(buffer);
              const pages = await pdf.copyPages(src, src.getPageIndices());
              pages.forEach(p => pdf.addPage(p));   
          }
         const mergedPdfBytes = await pdf.save();
         return Buffer.from(mergedPdfBytes);
    }
}