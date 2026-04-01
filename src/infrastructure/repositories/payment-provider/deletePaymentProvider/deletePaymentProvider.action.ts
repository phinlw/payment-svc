import { DeletePaymentProviderRequest, DeletePaymentProviderResponse } from '@domain/models/payment-provider.model';
import { PaymentProviderEntity } from '@infrastructure/entities/payment-provider.entity';
import { QueryRunner } from 'typeorm';
export class DeletePaymentProviderAction  extends DeletePaymentProviderResponse {
  constructor(private readonly session: QueryRunner) {
    super();
  }
  public async execute(params: DeletePaymentProviderRequest): Promise<DeletePaymentProviderResponse|null> {
      try {
        await this.buildParams(params);
        await this.DeletePaymentProvider();

        const response = {
              _id: this._id,
        };
        return response;
      }
      catch (error) {
        console.log('ERROR Execute', error?.message);
        throw error instanceof Error ? error : new Error(error?.message);
      }
    }

  private async buildParams(params: DeletePaymentProviderRequest): Promise<string> {
      try {
        this._id = params._id;
        return 'BuildParams completed';
      } catch (error) {
        console.log('ERROR BuildParams', error?.message);
        throw error instanceof Error ? error : new Error(error?.message);
      }
    }
  private async DeletePaymentProvider(): Promise<string> {
      try {
        const condition = {
          _id: this._id,
        };

        await this.session.manager.update(PaymentProviderEntity, condition, { isActive: false });

        return "PaymentProvider deleted successfully";
      } catch (error) {
        console.log('ERROR Delete', error?.message);
        throw error instanceof Error ? error : new Error(error?.message);
      }
    }
}