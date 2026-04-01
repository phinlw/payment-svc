import { CreateGenerateQrRequest, CreateGenerateQrResponse } from '@domain/models/generate-qr.model';
import { 
  validateText,
  validateNumber,
  validateMultiple
} from '@shared/utils/base.util';
import { Repository } from 'typeorm';
import { GenerateQrEntity } from '@infrastructure/entities/generate-qr.entity';

export class CreateGenerateQrValidation  extends CreateGenerateQrRequest {
  constructor(private readonly generateQrRepository: Repository<GenerateQrEntity>) {
    super();
  }

  public async execute(params: CreateGenerateQrRequest): Promise<void> {
    try {

        await this.buildParams(params);
        await this.validateParams();
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }

  private async buildParams(params: CreateGenerateQrRequest): Promise<void> {
      try {
        this.userId = params.userId;
        this.amount = params.amount;
        this.callbackUrl = params.callbackUrl;
        this.callbackKey = params.callbackKey;
        this.ref1 = params.ref1;
        this.ref2 = params.ref2;
        this.ref3 = params.ref3;

      } catch (error) {
        console.log('ERROR InitParams', error?.message);
        throw new Error(error?.message || 'Unknown error');
      }
    }

  private async validateParams(): Promise<void> {
      try {
        const validationResults = validateMultiple({
          userId: validateText(this.userId, {
            required: true,
            minLength: 2,
            maxLength: 100,
            allowEmpty: false,
          }),
          callbackUrl: validateText(this.callbackUrl, {
            required: true,
            minLength: 2,
            maxLength: 255,
            allowEmpty: false,
          }),
          callbackKey: validateText(this.callbackKey, {
            required: true,
            minLength: 2,
            maxLength: 255,
            allowEmpty: false,
          }),
          ref1: validateText(this.ref1, {
            required: true,
            minLength: 2,
            maxLength: 255,
            allowEmpty: false,
          }),
          ref2: validateText(this.ref2, {
            required: true,
            minLength: 2,
            maxLength: 255,
            allowEmpty: false,
          }),
          ref3: validateText(this.ref3, {
            required: true,
            minLength: 2,
            maxLength: 255,
            allowEmpty: false,
          }),
          amount: validateNumber(this.amount, {
            required: true,
            min: 1,
            max: 100000000,
          }),
        });

        // Check if validation failed
        if (!validationResults.isValid) {
          const errorMessages = Object.entries(validationResults.errors)
            .map(([field, message]) => `${field}: ${message}`)
            .join(', ');
          throw new Error(`Validation failed: ${errorMessages}`);
        }
      } catch (error) {
        console.log('ERROR ValidateParams', error?.message);
        throw new Error(error?.message || 'Unknown error');
      }
    }
  }