import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
     new ValidationPipe({
         whitelist: true,
         forbidNonWhitelisted: true
     })
  )
  app.enableCors()
  app.setGlobalPrefix("/api")
  app.useStaticAssets('outputs', { prefix: '/static' });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
