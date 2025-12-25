import { BadRequestException, Injectable } from "@nestjs/common";
import { PdfQueue } from "../queue/pdf.queue";
import { JobsService } from "../jobs/jobs.service";


@Injectable()
export class PdfService {
     constructor(private readonly queue: PdfQueue, private readonly jobsService: JobsService) {}
    async merge(files: Express.Multer.File []) {
        if(!files || files?.length == 0) {
            throw new BadRequestException("Files are required for merge !")
        }
        const filePathArr = files.map((file) => file.path);
        const job  = await this.jobsService.createJob("merge", filePathArr.join(",")); 
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
         return this.queue.getPdf(jobId);
     }
}