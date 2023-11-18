import { NestFactory } from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import { AppModule } from './app.module';
import {apiTitle, apiVersion} from "./config";

require('dotenv').config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const server = process.env['SERVER'] || 'http://localhost:3000'

  const config = new DocumentBuilder()
      .setTitle(apiTitle)
      .setDescription('APIs for Digital PDS service')
      .setVersion(apiVersion)
      .addServer(server)
      .addSecurity('basic', {
        type: 'http',
        scheme: 'basic',
      })
      .addExtension('x-ibm', {
          annotations: "true",
          "application-name": apiTitle,
          "application-id": "digital-pds",
          "skill-type": "imported"
      })
      .build();

  const document = SwaggerModule.createDocument(app, config);

  document.info['x-ibm-annotations'] = 'true';
  document.info['x-ibm-application-name'] = document.info.title;
  document.info['x-ibm-application-id'] = 'digital-pds';
  document.info['x-ibm-skill-type'] = 'imported';

  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap().catch(err => console.error(err));
