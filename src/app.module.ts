import 'dotenv/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { QueueModule } from './modules/queue/queue.module';
import { PdfModule } from './modules/pdf/pdf.module';
import { StorageModule } from './modules/storage/storage.module';
import { DatabaseModule } from './modules/database/database.module';
import { JobsModule } from './modules/jobs/jobs.module';


@Module({
  imports: [
      ConfigModule.forRoot({
          isGlobal: true,
          expandVariables: true,
      }),
      DatabaseModule,
      QueueModule,
      StorageModule,
      PdfModule,
      JobsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
