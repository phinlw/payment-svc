import { GenerateQrRequest } from '@domain/models/generate-rq.model';
import { Repository } from 'typeorm';
import { GenerateRqEntity } from '@infrastructure/entities/generate-rq.entity';

export class GenerateQrValidation {
  constructor(private readonly generateRqRepository: Repository<GenerateRqEntity>) {}

  public async execute(params: GenerateQrRequest): Promise<GenerateQrRequest> {
    try {
      await this.validateParams(params);
      return params;
    } catch (error) {
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  private async validateParams(params: GenerateQrRequest): Promise<void> {
    try {
      if (!params || Object.keys(params).length === 0) {
        throw new Error('Validation failed: request body is required');
      }
    } catch (error) {
      console.log('ERROR ValidateParams', error?.message);
      throw new Error(error?.message || 'Unknown error');
    }
  }
}
