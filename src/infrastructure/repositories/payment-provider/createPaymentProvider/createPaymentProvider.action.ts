import { _ID } from '@shared/utils/base.util';
import { PaymentProviderModel, CreatePaymentProviderResponse, CreatePaymentProviderRequest } from '@domain/models/payment-provider.model';
import { PaymentProviderEntity } from '@infrastructure/entities/payment-provider.entity';
import { QueryRunner } from 'typeorm';

export class CreatePaymentProviderAction  extends PaymentProviderModel {
  constructor(private readonly session: QueryRunner) {
    super();
  }

  public async execute(params: CreatePaymentProviderRequest): Promise<CreatePaymentProviderResponse> {
    try {
      await this.validateAndBuildParams(params);
      const model = await this.preparePaymentProviderModel();
      await this.persistPaymentProvider(model);

      return this.buildResponse();
    } catch (error) {
      console.error('ERROR CreatePaymentProviderAction.execute', error?.message);
      throw error instanceof Error ? error : new Error(error?.message || String(error));
    }
  }

  /**
   * Validate and build parameters
   */
  private async validateAndBuildParams(params: CreatePaymentProviderRequest): Promise<void> {
    try {
      this.name = params.name;
      this.img = params.img;
      this.amount = params.amount;
      this.isActive = true;
      this.createdAt = new Date();
      this.updatedAt = new Date();
    } catch (error) {
      console.error('ERROR validateAndBuildParams', error?.message);
      throw new Error(`Failed to validate parameters: ${error?.message || String(error)}`);
    }
  }

  /**
   * Prepare model for insertion
   */
  private async preparePaymentProviderModel(): Promise<PaymentProviderModel> {
    try {
      const model: PaymentProviderModel = {
        _id: _ID(),
        uniqueId: 0,
        name: this.name,
        img: this.img,
        amount: this.amount,
        isActive: this.isActive || true,
        createdAt: this.createdAt || new Date(),
        updatedAt: this.updatedAt || new Date(),
      };

      return model;
    } catch (error) {
      console.error('ERROR preparePaymentProviderModel', error?.message);
      throw new Error(`Failed to prepare model: ${error?.message || String(error)}`);
    }
  }

  /**
   * Persist entity to database
   */
  private async persistPaymentProvider(model: PaymentProviderModel): Promise<void> {
    try {
      const savedEntity = await this.session.manager.save(PaymentProviderEntity, model);

      if (savedEntity) {
        this._id = savedEntity._id;
        this.uniqueId = savedEntity.uniqueId;
      } else {
        throw new Error('Failed to save entity into database');
      }
    } catch (error) {
      console.error('ERROR persistPaymentProvider', error?.message);
      throw new Error(`Failed to persist entity: ${error?.message || String(error)}`);
    }
  }

  /**
   * Build response object
   */
  private buildResponse(): CreatePaymentProviderResponse {
    try {
      return {
        _id: this._id,
        uniqueId: this.uniqueId,
        name: this.name,
        img: this.img,
        amount: this.amount,
        isActive: this.isActive,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      };
    } catch (error) {
      console.error('ERROR buildResponse', error?.message);
      throw new Error(`Failed to build response: ${error?.message || String(error)}`);
    }
  }
}