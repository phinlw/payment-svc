import { Module } from '@nestjs/common';
import { EnvironmentConfigService } from './environment-config.service';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from "./config.module";

@Module({
  imports: [ConfigModule],
  providers: [EnvironmentConfigService, ConfigService],
  exports: [EnvironmentConfigService, ConfigModule],
})
export class EnvironmentConfigModule {}