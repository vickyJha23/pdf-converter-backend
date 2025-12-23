import { BadRequestException, Injectable } from "@nestjs/common";
import { PdfQueue } from "../queue/pdf.queue";


@Injectable()
export class PdfService {
     constructor(private readonly queue: PdfQueue) {}
     merge(files: Express.Multer.File []) {
        if(!files || files?.length == 0) {
            throw new BadRequestException("Files are required for merge !")
        }
        const filePathArr = files.map((file) => file.path)
        return this.queue.addMergeJob(filePathArr);   
     }

     async getStatus(jobId: string) {
          if(!jobId) {
              throw new BadRequestException("JobId is required !")
          }
          return this.queue.getJobStatus(jobId);
     }

     async downloadPdf(jodId: string) {
         if(!jodId) {
             throw new BadRequestException("Job id is required !")
         }
         return this.queue.getPdf(jodId);
     }
}