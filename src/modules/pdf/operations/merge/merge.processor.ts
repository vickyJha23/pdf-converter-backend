import { MERGE_JOB, PDF_QUEUE } from "src/common/constants/queue.constant";
import { MergeService } from "./merge.service";
import { Worker } from "bullmq";
import * as fs from 'fs';
import * as path from 'path';
import { redisConfig } from "src/config";
import { StorageService } from "src/modules/storage/storage.service";



const service = new MergeService();
const storage = new StorageService()

new Worker(PDF_QUEUE, async (job) => {
     if(job.name !== MERGE_JOB) return;
     const buffer = await service.merge(job.data.files);
     const filePath = await storage.saveLocal(buffer, `merged-${Date.now()}.pdf`)
     return filePath;
}, {connection: redisConfig})