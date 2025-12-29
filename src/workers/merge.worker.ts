import 'dotenv/config';
import { MERGE_JOB, PDF_QUEUE } from 'src/common/constants/queue.constant';
import { MergeService } from '../modules/pdf/operations/merge/merge.service';
import { Worker } from 'bullmq';
import { redisConfig } from 'src/config';
import { StorageService } from 'src/modules/storage/storage.service';
import { JobsService } from 'src/modules/jobs/jobs.service';
import { JobEntity, JobStatus } from 'src/modules/jobs/jobs.entity';
import { WorkerDataSource } from './worker-db';

async function bootstrap() {
  console.log('Merged file saved at:');
  await WorkerDataSource.initialize();
  console.log("🟢 DB connected");
  const jobRepository = WorkerDataSource.getRepository(JobEntity);
  const jobsService = new JobsService(jobRepository);
  const service = new MergeService();
  const storage = new StorageService();
  console.log('🟢 Services initialized');
  const worker = new Worker(
    PDF_QUEUE,
    async (job) => {
      if (job.name !== MERGE_JOB) return;
      const { jobId, files } = job.data;
      try {
        await jobsService.updateStatus(jobId, JobStatus.PROCESSING);
        await job.updateProgress(10);
        const buffer = await service.merge(files);
        await job.updateProgress(70);
        const filePath = await storage.saveLocal(
          buffer,
          `merged-${Date.now()}.pdf`,
        );
        await job.updateProgress(100)
        await jobsService.updateStatus(jobId, JobStatus.COMPLETED, filePath.filePath, 100);
        return filePath;
      } catch (error) {
        console.error('Error processing merge job:', error);
        await jobsService.updateStatus(jobId, JobStatus.FAILED, null, error.message);
      }
    },
    { connection: redisConfig },
  );
  worker.on('ready', () => console.log('🟢 Worker is ready'));
  worker.on('active', job => console.log('⚙️ Processing job', job.id));
  worker.on('completed', job => console.log('✅ Job completed', job.id));
  worker.on('failed', (job, err) => console.log('❌ Job failed', job?.id, err));
}

bootstrap();

// import { WorkerDataSource } from './worker-db';

async function start() {
  console.log('🚀 PDF Worker started');

  await WorkerDataSource.initialize();
  console.log('🟢 DB connected');

  setInterval(() => {
    console.log('💓 Worker alive', new Date().toISOString());
  }, 3000);
}

// start().catch(err => console.error(err));
