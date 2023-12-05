import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import cors from 'cors'
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: `${process.env.URL}:3001`, // URL de votre frontend
    credentials: true, // Permet l'envoi de cookies
  });
  // app.use(cors());
  await app.listen(3000);
}
bootstrap();

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
// import cors from 'cors'
// import { NestExpressApplication } from "@nestjs/platform-express";
// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import { ValidationPipe } from "@nestjs/common";
// import { IoAdapter } from '@nestjs/platform-socket.io';
// async function bootstrap() {
//   const app = await NestFactory.create<NestExpressApplication>(AppModule, {
//     cors: true,
//   });
//   app.useWebSocketAdapter(new IoAdapter(app));
//   app.enableCors({
//     origin: `${process.env.URL}:3001`, // URL de votre frontend
//     credentials: true, // Permet l'envoi de cookies
//   });

//   // app.use(cors());
//   await app.listen(3000);
// }
// bootstrap();