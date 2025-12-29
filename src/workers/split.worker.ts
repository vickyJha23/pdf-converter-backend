import { PDF_QUEUE } from "src/common/constants/queue.constant";
import { redisConfig } from "src/config";
import {Worker } from "bullmq";
import { WorkerDataSource } from "./worker-db";
import { JobEntity, JobStatus } from "src/modules/jobs/jobs.entity";
import { JobsService } from "src/modules/jobs/jobs.service";




async function bootstrap() {
    await WorkerDataSource.initialize();

    console.log("DB connected");
    
    const jobRepository = WorkerDataSource.getRepository(JobEntity);
    const jobService = new JobsService(jobRepository);


    const worker = new Worker(PDF_QUEUE, async (job) => {

          if(job.name !== "split-pdf") {
                return;
          }
         try {
             const {jobId, files} = job.data;
             await jobService.updateStatus(jobId, JobStatus.PROCESSING);
             // Tod o: Implement split logic here
            
         } catch (error) {
              console.error('Error processing split job:', error);

         }
          worker.on('ready', () => console.log('Worker is ready'));
          worker.on('active', job => console.log('Processing job', job.id));
          worker.on('completed', job => console.log('Job completed', job.id));
          worker.on('failed', (job, err) => console.log('Job failed', job?.id, err));
        }, {connection: redisConfig} );


}



bootstrap();