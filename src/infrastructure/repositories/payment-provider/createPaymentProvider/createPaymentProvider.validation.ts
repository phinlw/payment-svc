import { CreatePaymentProviderRequest, CreatePaymentProviderResponse } from '@domain/models/payment-provider.model';
import { 
  validateText,
  validateMultiple
} from '@shared/utils/base.util';
import { Repository } from 'typeorm';
import { PaymentProviderEntity } from '@infrastructure/entities/payment-provider.entity';

export class CreatePaymentProviderValidation  extends CreatePaymentProviderRequest {
  constructor(private readonly paymentProviderRepository: Repository<PaymentProviderEntity>) {
    super();
  }

  public async execute(params: CreatePaymentProviderRequest): Promise<CreatePaymentProviderRequest> {
    try {

        await this.buildParams(params);
        await this.validateParams();

        const response = {
          name: this.name,
        };
        return response;
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }

  private async buildParams(params: CreatePaymentProviderRequest): Promise<void> {
      try {
        this.name = params.name;

      } catch (error) {
        console.log('ERROR InitParams', error?.message);
        throw new Error(error?.message || 'Unknown error');
      }
    }

  private async validateParams(): Promise<void> {
      try {
        const validationResults = validateMultiple({
          name: validateText(this.name, { 
            required: true, 
            minLength: 2, 
            maxLength: 100,
            allowEmpty: false 
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