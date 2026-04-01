import { Injectable } from '@nestjs/common';
import { DatabaseConfigInterface } from '@domain/config/databaseConfig.interface';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class EnvironmentConfigService implements DatabaseConfigInterface {
  constructor(private readonly configService: ConfigService) {}

  getDBHost(): string {
    return this.configService.get<string>('DATABASE_HOST') ?? '';
  }
  getDBName(): string {
    return this.configService.get<string>('DATABASE_DB') ?? '';
  }
  getDBPort(): number {
    return this.configService.get<number>('DATABASE_PORT') ?? 5432;
  }
  getDBUser(): string {
    return this.configService.get<string>('DATABASE_USER') ?? '';
  }
  getDBPass(): string {
    return this.configService.get<string>('DATABASE_PASSWORD') ?? '';
  }
}