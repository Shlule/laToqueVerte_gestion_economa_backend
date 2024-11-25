import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/http-exception-filter/http-exception-filter.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors ({
    origin: 'http://localhost:3333', 
    methods: 'GET,POST,PUT,DELETE,OPTIONS', 
    allowedHeaders: 'Content-Type,Authorization', 
    credentials: true, 
  });
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
