import { Controller, Get, Param, Post, UploadedFiles, UseInterceptors, Res, UploadedFile } from "@nestjs/common";
import { PdfService } from "./services/pdf.service";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { multerOptions } from "src/config";
import type { Response } from "express";
import path from "path";


@Controller('pdf')
export class PdfController {
     constructor(private readonly pdfService: PdfService) {}

     @Post('merge')
     @UseInterceptors(FilesInterceptor('files', 10, multerOptions))
     async merge (@UploadedFiles() files: Express.Multer.File []) {
        console.log("files", files);  
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
         console.log('filePath', filePath);
         res.setHeader('Content-Disposition', `attachment; filename=${filePath.split('\\').pop()}`); 
         const absolutePath = path.resolve(filePath);
         res.sendFile(absolutePath);  
    }

    @Post("upload") 
    @UseInterceptors(FileInterceptor('file', multerOptions))    
    async uploadPdf(@UploadedFile() file: Express.Multer.File) {
        return await this.pdfService.uploadPdf(file);
    } 

    @Post("split")
    async split(@UploadedFiles() files: Express.Multer.File []) {
            return await this.pdfService.split(files);
    } 
}