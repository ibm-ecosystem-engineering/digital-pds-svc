import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, OpenAPIObject, SwaggerModule} from "@nestjs/swagger";
import {AppModule} from './app.module';
import {apiTitle, apiVersion} from "./config";
import {enhanceApiSpec} from "./controllers";

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
      .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);

  addApiSpecInfoExtensions(document);
  enhanceApiSpec(document);

  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap().catch(err => console.error(err));


const addApiSpecInfoExtensions = (document: OpenAPIObject): OpenAPIObject => {
    document.info['x-ibm-annotations'] = 'true';
    document.info['x-ibm-application-name'] = document.info.title;
    document.info['x-ibm-application-id'] = 'digital-pds';
    document.info['x-ibm-skill-type'] = 'imported';

    return document;
}
