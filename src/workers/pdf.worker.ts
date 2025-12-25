import { MERGE_JOB, PDF_QUEUE } from 'src/common/constants/queue.constant';
import { MergeService } from '../modules/pdf/operations/merge/merge.service';
import {Worker } from 'bullmq';
import { redisConfig } from 'src/config';
import { StorageService } from 'src/modules/storage/storage.service';
import { JobsService } from 'src/modules/jobs/jobs.service';
import { JobEntity } from 'src/modules/jobs/jobs.entity';
import { WorkerDataSource } from './worker-db';

async function bootstrap() {
  await WorkerDataSource.initialize();
  const jobRepository = WorkerDataSource.getRepository(JobEntity);
  const jobsService = new JobsService(jobRepository);
  const service = new MergeService();
  const storage = new StorageService();
  new Worker(
    PDF_QUEUE,
    async (job) => {
      if (job.name !== MERGE_JOB) return;
      const { jobId, files } = job.data;
      await this.jobsService.updateStatus(jobId, 'processing');  
      const buffer = await service.merge(files);
      const filePath = await storage.saveLocal(
        buffer,
        `merged-${Date.now()}.pdf`,
      );
      await this.jobsService(jobId, 'completed', filePath);
      return filePath;
    },
    { connection: redisConfig },
  );
}

bootstrap();
