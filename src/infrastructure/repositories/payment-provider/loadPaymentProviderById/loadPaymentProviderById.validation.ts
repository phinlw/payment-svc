import { LoadPaymentProviderByIdRequest } from '@domain/models/payment-provider.model';
import { PaymentProviderEntity } from '@infrastructure/entities/payment-provider.entity';
import { Repository } from 'typeorm';
export class LoadPaymentProviderByIdValidation  extends LoadPaymentProviderByIdRequest {
  constructor(private readonly paymentProviderRepository: Repository<PaymentProviderEntity>) {
    super();
  }
  public async execute(params: LoadPaymentProviderByIdRequest): Promise<any> {
      try {
        await this.buildParams(params);
        await this.validateParams();

        const response = {
          _id: this._id
          };
        return response;
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }
  private async buildParams(params: LoadPaymentProviderByIdRequest): Promise<string> {
    try {
        this._id = params._id;
        return 'BuildParams completed';
      } catch (error) {
        console.log('ERROR BuildParams', error?.message);
        throw error instanceof Error ? error : new Error(error?.message);
      }
    }
  private async validateParams(): Promise<string> {
      try {
        if (!this._id) {
          throw new Error('Invalid params');
        }

        return 'ValidateParams completed';
      } catch (error) {
        console.log('ERROR ValidateParams', error?.message);
        throw error instanceof Error ? error : new Error(error?.message);
      }
    }
  }