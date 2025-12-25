import { Module } from "@nestjs/common";
import { QueueModule } from "../queue/queue.module";
import { PdfController } from "./pdf.controller";
import { PdfService } from "./pdf.service";
import { JobsModule } from "../jobs/jobs.module";


@Module({
     imports: [QueueModule, JobsModule],
     controllers: [PdfController],
     providers: [PdfService],
})

export class PdfModule {}