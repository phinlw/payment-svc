import { Module } from '@nestjs/common';
import { EnvironmentConfigService } from '../environment-config/environment-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentConfigModule } from '../environment-config/environment-config.module';
import * as dotenv from 'dotenv';
dotenv.config();
import { GenerateQrEntity } from '@infrastructure/entities/generate-qr.entity';

export const getTypeOrmModuleOptions = (
  config: EnvironmentConfigService,
): any => ({
  type: 'postgres',
  host: config.getDBHost(),
  port: config.getDBPort(),
  username: config.getDBUser(),
  password: config.getDBPass(),
  database: config.getDBName(),
  entities: [GenerateQrEntity],
  synchronize: true,
});

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      inject: [EnvironmentConfigService],
      useFactory: getTypeOrmModuleOptions,
    }),
  ],
})
export class TypeOrmConfigModule {}