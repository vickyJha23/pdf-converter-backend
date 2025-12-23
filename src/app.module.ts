import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { QueueModule } from './modules/queue/queue.module';
import { PdfModule } from './modules/pdf/pdf.module';
import { StorageModule } from './modules/storage/storage.module';

@Module({
  imports: [
      ConfigModule.forRoot({
          isGlobal: true
      }),
      QueueModule,
      StorageModule,
      PdfModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
