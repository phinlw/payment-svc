import { LoadAllPaymentProviderRequest } from '@domain/models/payment-provider.model';
import { PaymentProviderEntity } from '@infrastructure/entities/payment-provider.entity';
import { Repository } from 'typeorm';
export class LoadAllPaymentProviderValidation  extends LoadAllPaymentProviderRequest {
  constructor(private readonly paymentProviderRepository: Repository<PaymentProviderEntity>) {
    super();
  }

  public async execute(params: LoadAllPaymentProviderRequest): Promise<any> {
      try {
        await this.InitParams(params);
        await this.ValidateParams();

        const response = {};
        return response;
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }

  private async InitParams(params: LoadAllPaymentProviderRequest): Promise<string> {
      try {
        this.name = params.name;
        return 'InitParams completed';
      } catch (error) {
        console.log('ERROR InitParams', error?.message);
        throw error instanceof Error ? error : new Error(error?.message);
      }
    }
  private async ValidateParams(): Promise<string> {
      try {
        if (!this.name) {
          throw new Error('Invalid params');
        }

        return 'ValidateParams completed';
      } catch (error) {
        console.log('ERROR ValidateParams', error?.message);
        throw error instanceof Error ? error : new Error(error?.message);
      }
    }
  }