/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { PaymentProviderRepoImpl } from './payment-provider/payment-provider.repository';
import { PaymentProviderEntity } from '@infrastructure/entities/payment-provider.entity';
import { GenerateQrRepoImpl } from './generate-qr/generate-qr.repository';
import { GenerateQrEntity } from '@infrastructure/entities/generate-qr.entity';
import { TypeOrmConfigModule } from '../config/typeorm/typeorm.module';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    TypeOrmConfigModule,
    TypeOrmModule.forFeature([PaymentProviderEntity, GenerateQrEntity, ]),
  ],
  providers: [PaymentProviderRepoImpl, GenerateQrRepoImpl],
  exports: [PaymentProviderRepoImpl, GenerateQrRepoImpl],
})
export class RepositoriesModule {}