/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { GenerateRqRepoImpl } from './generate-rq/generate-rq.repository';
import { GenerateRqEntity } from '@infrastructure/entities/generate-rq.entity';
import { TypeOrmConfigModule } from '../config/typeorm/typeorm.module';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    TypeOrmConfigModule,
    TypeOrmModule.forFeature([GenerateRqEntity, ]),
  ],
  providers: [GenerateRqRepoImpl],
  exports: [GenerateRqRepoImpl],
})
export class RepositoriesModule {}