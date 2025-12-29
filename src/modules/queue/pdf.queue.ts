import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Queue } from "bullmq";
import { MERGE_JOB, PDF_QUEUE, SPLIT_JOB } from "src/common/constants/queue.constant";
import { redisConfig } from "src/config";



@Injectable()
export class PdfQueue {
     private queue:any;
     constructor () {
         this.queue = new Queue(PDF_QUEUE, {connection: redisConfig})
     }
     addMergeJob(jobId: string, files: string []) {
           return this.queue.add(MERGE_JOB, {
             jobId,
            files}, {
               jobId
            }) 
     }

    async getJobStatus(jobId: string) {
          console.log("jobId", jobId);
          const job = await this.queue.getJob(jobId);
          console.log('Job fetched:', job);
        if(!job) {
             throw new NotFoundException("Job Not Found") 
        }
        const state = await job.getState();

        return {
             jobId: job.id,
             state,
             progress: job.progress,
             result: job.returnvalue ?? null,
             failedReason: job.failedReason ?? null 
        }
     }

     async getPdf(jobId: string) {
           const fileData = await this.getJobStatus(jobId);
           console.log(fileData);
           const {state, result} = fileData;
           if(state !== "completed") {
                 throw new BadRequestException("File Not ready yet!");
           }
           if(!result) {
                 throw new NotFoundException("File path not found");
           }
           console.log("result", result.filePath);
           return result?.filePath;
     }

     addSplitJob(jobId: string, files: string []) {
          return this.queue.add(SPLIT_JOB, {
               jobId,
               files
          }) 
     }
}