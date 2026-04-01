import { CreateGenerateRqRequest, CreateGenerateRqResponse } from '@domain/models/generate-rq.model';
import { 
  validateText,
  validateNumber,
  validateMultiple
} from '@shared/utils/base.util';
import { Repository } from 'typeorm';
import { GenerateRqEntity } from '@infrastructure/entities/generate-rq.entity';

export class CreateGenerateRqValidation  extends CreateGenerateRqRequest {
  constructor(private readonly generateRqRepository: Repository<GenerateRqEntity>) {
    super();
  }

  public async execute(params: CreateGenerateRqRequest): Promise<void> {
    try {

        await this.buildParams(params);
        await this.validateParams();
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }

  private async buildParams(params: CreateGenerateRqRequest): Promise<void> {
      try {
        this.userId = params.userId;
        this.amount = params.amount;

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
            allowEmpty: false 
          }),
          amount: validateNumber(this.amount, {
            required: true,
            min: 1,
            max: 100000000
          })
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