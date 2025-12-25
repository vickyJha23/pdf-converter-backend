import { Controller, Get, Param, Post, UploadedFiles, UseInterceptors, Res } from "@nestjs/common";
import { PdfService } from "./pdf.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { multerOptions } from "src/config";
import type { Response } from "express";
import path from "path";


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
    async downloadPdf(@Param("jobId") jobId: string, @Res() res:Response) {
         console.log("jobId", jobId);
         const { filePath } = await this.pdfService.downloadPdf(jobId);
         res.setHeader('Content-Disposition', `attachment; filename=${filePath.split('\\').pop()}`); 
         const absolutePath = path.resolve(filePath);
         res.sendFile(absolutePath);  
    }
}