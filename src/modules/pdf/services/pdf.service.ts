import { BadRequestException, Injectable } from "@nestjs/common";
import { PdfQueue } from "../../queue/pdf.queue";
import { JobsService } from "../../jobs/jobs.service";
import { PdfPreviewService } from "./pdfPreview.service";
import path from "path";


@Injectable()
export class PdfService {
     constructor(private readonly queue: PdfQueue, 
        private readonly jobsService: JobsService,
        private readonly pdfPreviewService: PdfPreviewService
    ) {}
    async merge(files: Express.Multer.File []) {
        if(!files || files?.length == 0) {
            throw new BadRequestException("Files are required for merge !")
        }
        const filePathArr = files.map((file) => file.path);
        const job  = await this.jobsService.createJob("merge", path.dirname(filePathArr[0])); 
        return  await this.queue.addMergeJob(job.id, filePathArr);
     }
     async getStatus(jobId: string) {
          if(!jobId) {
              throw new BadRequestException("JobId is required !")
          }
          return this.queue.getJobStatus(jobId);
     }

     async downloadPdf(jobId: string) {
         if(!jobId) {
             throw new BadRequestException("Job id is required !")
         }
         const filePath = await this.queue.getPdf(jobId);
         console.log(filePath);
         return { filePath  };
     }

     async uploadPdf(file: Express.Multer.File) {   
           if(!file) {
               throw new BadRequestException("Files are required for upload");    
           }
           const previews = await this.pdfPreviewService.generate(file.path);
           return {
               previews
           }

     }


     async split(files: Express.Multer.File []) {
            if(!files || files.length == 0) {
                 throw new BadRequestException("Files are required for split ")
            }

          const filePathArr = files.map((file) => file.path);
            const job = await this.jobsService.createJob("split", filePathArr.join(","));
            return await this.queue.addSplitJob(job.id, filePathArr);  
     }
}