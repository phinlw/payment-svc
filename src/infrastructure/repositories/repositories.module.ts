/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { GenerateQrRepoImpl } from './generate-qr/generate-qr.repository';
import { GenerateQrEntity } from '@infrastructure/entities/generate-qr.entity';
import { TypeOrmConfigModule } from '../config/typeorm/typeorm.module';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    TypeOrmConfigModule,
    TypeOrmModule.forFeature([GenerateQrEntity, ]),
  ],
  providers: [GenerateQrRepoImpl],
  exports: [GenerateQrRepoImpl],
})
export class RepositoriesModule {}