import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  
  const PORT = process.env.PORT;
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const config = new DocumentBuilder()
  .setTitle("Qubit Vortex")
  .setDescription("Документация REST API")
  .setVersion("1.0.0")
  .addTag("qubit vortex")
  .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/api/docs", app, document)

  await app.listen(PORT, () => console.log(`server started on PORT ${PORT}`));
}
bootstrap();
