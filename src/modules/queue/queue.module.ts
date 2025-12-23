import { Module } from "@nestjs/common";
import { PdfQueue } from "./pdf.queue";


@Module({
      providers: [PdfQueue],
      exports: [PdfQueue]
})

export class QueueModule {}