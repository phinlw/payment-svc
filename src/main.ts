/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

    
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
    const port = process.env.SERVER_PORT;
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: ["generateQr"],
      protoPath: [join(__dirname,
         './_proto/common.proto'),
         join(__dirname, './_proto/generate-qr.proto')],
      url: `0.0.0.0:${port}`,
    },
  });

  await app.startAllMicroservices();
}
bootstrap();