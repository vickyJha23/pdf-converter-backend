import { Module } from "@nestjs/common";
import { QueueModule } from "../queue/queue.module";
import { PdfController } from "./pdf.controller";
import { PdfService } from "./services/pdf.service";
import { JobsModule } from "../jobs/jobs.module";
import { PdfPreviewService } from "./services/pdfPreview.service";


@Module({
     imports: [QueueModule, JobsModule],
     controllers: [PdfController],
     providers: [PdfService, PdfPreviewService],
})

export class PdfModule {}