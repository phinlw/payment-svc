/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsecasesProxyModule } from '../usecases-proxy/usecases-proxy.module';
import { GenerateRqController } from './generate-rq/generate-rq.controller';

@Module({
  imports: [UsecasesProxyModule.register()],
  controllers: [GenerateRqController],
})
export class ControllersModule {};