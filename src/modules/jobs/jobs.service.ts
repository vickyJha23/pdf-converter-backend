import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JobEntity, JobStatus } from "./jobs.entity";
import { Repository } from "typeorm";

@Injectable() 
export class JobsService {
    constructor(@InjectRepository(JobEntity) private readonly jobRepo: Repository<JobEntity>) {}

async createJob(type: string, inputPath:string): Promise<JobEntity> {
        if(!type || !inputPath) {
            throw new BadRequestException("Type and inputPath are required to create a job.");
        }
        const job = this.jobRepo.create({
            type,
            inputPath,
            status: JobStatus.PENDING,
            progress: 0
        });
        return this.jobRepo.save(job);
    }

   async updateStatus(jobId:string, status: JobStatus, result?:any) {
        const job = await this.jobRepo.findOne({
             where: {
                 id: jobId
             }
        })
        if(!job){
             throw new NotFoundException("Job Not Found");
        }
        job.status = status;
        if(result) {
            job.outputPath = result
        }
        await this.jobRepo.save(job);
   } 
}