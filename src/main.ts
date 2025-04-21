import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { customValidationPipe, AllExceptionsFilter } from './common/z_index';
import * as express from 'express';

const port = process.env.PORT ?? 3000;

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  // Global Validation
  app.useGlobalPipes(
    new customValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter()); // Global Error Handling

  app.enableCors({
    origin: '*',
  });

  app.use('/order/webhook', express.raw({ type: 'application/json' }));

  await app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

bootstrap().catch((error) => {
  console.log('Error during application bootstrap:', error);
});
