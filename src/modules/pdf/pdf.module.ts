import { Module } from "@nestjs/common";
import { QueueModule } from "../queue/queue.module";
import { PdfController } from "./pdf.controller";
import { PdfService } from "./pdf.service";


@Module({
     imports: [QueueModule],
     controllers: [PdfController],
     providers: [PdfService],
})

export class PdfModule {}