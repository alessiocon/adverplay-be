import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, HttpStatus, ValidationPipe } from '@nestjs/common';

import * as cookieParser from 'cookie-parser';
import { ResFetch } from './models/Response.model';
import { ExceptionMenager } from './ExceptionMenager';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({stopAtFirstError: false, 
    exceptionFactory: (errors) => {
      let res : ResFetch<boolean>= {data: false, error:{}};
      errors.map((error) => {
        res.error[error.property] = error.constraints[Object.keys(error.constraints)[0]]
      });
      res.error["validationPipe"] = "yes";
      return new BadRequestException(res);
    }, 
  }));

  app.useGlobalFilters(new ExceptionMenager())

  app.enableCors({
    origin: process.env.EXTERNAL_HOST.split(","),
    credentials: true, 
    methods:["GET","POST","DELETE"], });

  app.setGlobalPrefix('api');
  app.use(cookieParser());

  const config = new DocumentBuilder()
  .setTitle('AdverPlay')
  .setDescription('The AdverPlay API description')
  .setVersion('1.0')
  .addTag('AdverPlay')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
  )
  .build();
  

  if(process.env.NODE_ENV === "development"){
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
  }
  

  await app.listen(process.env.PORT ?? 3001, () => {
    console.log(`Server started at port ${process.env.PORT ?? 3001}`)
  });
}
bootstrap();


//TODO: sistemare tutti i log per il server Heroku 24/06/2024


//se vuoi startare e vedere le modifiche in tempo reale (lato server) npm run start:dev
//creazione di controller con validazione nest g resource [name]
//creazione controller    $ nest g controller [name]
//creazione modulo $ nest g module [name]