import { RetryPaymentRequest } from '@domain/models/generate-qr.model';
import { GenerateQrEntity } from '@infrastructure/entities/generate-qr.entity';
import { Repository } from 'typeorm';
import { validateMultiple, validateText } from '@shared/utils/base.util';

export class RetryPaymentValidation extends RetryPaymentRequest {
  constructor(private readonly generateQrRepository: Repository<GenerateQrEntity>) {
    super();
  }

  public async execute(params: RetryPaymentRequest): Promise<RetryPaymentRequest> {
    try {
      await this.buildParams(params);
      await this.validateParams();

      const response = {
        _id: this._id,
      };
      return response;
    } catch (error) {
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  private async buildParams(params: RetryPaymentRequest): Promise<void> {
    try {
      this._id = params._id;
    } catch (error) {
      console.log('ERROR buildParams', error?.message);
      throw new Error(error?.message || 'Unknown error');
    }
  }

  private async validateParams(): Promise<void> {
    try {
      const validationResults = validateMultiple({
        _id: validateText(this._id, { required: true, minLength: 1, allowEmpty: false }),
      });
      if (!validationResults.isValid) {
        const errorMessages = Object.entries(validationResults.errors)
          .map(([field, message]) => `${field}: ${message}`)
          .join(', ');
        throw new Error(`Validation failed: ${errorMessages}`);
      }
    } catch (error) {
      console.log('ERROR validateParams', error?.message);
      throw new Error(error?.message || 'Unknown error');
    }
  }
}
