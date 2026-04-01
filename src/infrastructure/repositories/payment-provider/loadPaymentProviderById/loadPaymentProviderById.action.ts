import { LoadPaymentProviderByIdRequest, LoadPaymentProviderByIdResponse } from '@domain/models/payment-provider.model';
import { PaymentProviderEntity } from '@infrastructure/entities/payment-provider.entity';
import { QueryRunner } from 'typeorm';


export class LoadPaymentProviderByIdAction  extends LoadPaymentProviderByIdResponse {
  constructor(private readonly session: QueryRunner) {
    super();
  }


  public async execute(params: LoadPaymentProviderByIdRequest): Promise<LoadPaymentProviderByIdResponse|null> {
    try {
        await this.validateParams(params);
        const entity = await this.fetchPaymentProviderById();
        await this.mapEntityToResponse(entity);


        return this.buildResponse();
      } catch (error) {
        console.error('ERROR LoadPaymentProviderByIdAction.execute', error?.message);
        throw error instanceof Error ? error : new Error(error?.message);
      }
    }


  /**
   * Validate parameters
   */
  private async validateParams(params: LoadPaymentProviderByIdRequest): Promise<void> { 
      try {
        if (!params._id) {
          throw new Error('PaymentProvider ID is required');
        }
        this._id = params._id;
      } catch (error) {
        console.error('ERROR validateParams', error?.message);
        throw new Error(`Failed to validate parameters: ${error?.message}`);
      }
    }


  /**
   * Fetch payment-provider entity from database
   */
  private async fetchPaymentProviderById(): Promise<PaymentProviderEntity> {
      try {
        const condition = {
          where: {
            _id: this._id,
          },
        };


        const entity = await this.session.manager.findOne(PaymentProviderEntity, condition);


        if (!entity) {
          throw new Error('PaymentProvider not found');
        }


        return entity;
      }
      catch (error) {
        console.error('ERROR fetchPaymentProviderById', error?.message);
        throw new Error(`Failed to fetch payment-provider: ${error?.message}`);
      }
    }


  /**
   * Map entity to response properties
   */
  private async mapEntityToResponse(entity: PaymentProviderEntity): Promise<void> {
      try {
        this._id = entity._id;
        this.uniqueId = entity.uniqueId;
        this.name = entity.name;
        this.img = entity.img;
        this.amount = entity.amount;
        this.isActive = entity.isActive;
        this.createdAt = entity.createdAt;
        this.updatedAt = entity.updatedAt;
      } catch (error) {
        console.error('ERROR mapEntityToResponse', error?.message);
        throw new Error(`Failed to map entity to response: ${error?.message}`);
      }
    }


  /**
   * Build final response
   */
  private buildResponse(): LoadPaymentProviderByIdResponse {
      try {
        return {
          _id: this._id,
          uniqueId: this.uniqueId,
          isActive: this.isActive,
          createdAt: this.createdAt,
          updatedAt: this.updatedAt,
          name: this.name,
          img: this.img,
          amount: this.amount,
        };
      } catch (error) {
        console.error('ERROR buildResponse', error?.message);
        throw new Error(`Failed to build response: ${error?.message}`);
      }
    }
}