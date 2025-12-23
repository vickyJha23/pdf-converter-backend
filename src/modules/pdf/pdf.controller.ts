import { Controller, Get, Param, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { PdfService } from "./pdf.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { multerOptions } from "src/config";


@Controller('pdf')
export class PdfController {
     constructor(private readonly pdfService: PdfService) {}

     @Post('merge')
     @UseInterceptors(FilesInterceptor('files', 10, multerOptions))
     async merge (@UploadedFiles() files: Express.Multer.File []) {
          return this.pdfService.merge(files);     
      }
     
     @Get("status/:jobId")
     async getStatus(@Param("jobId") jobId: string) {
         return this.pdfService.getStatus(jobId);   
     } 

    @Get("download/:jobId")
    async downloadPdf(@Param("jodId") jobId: string) {
        return this.pdfService.downloadPdf(jobId)
    }
}