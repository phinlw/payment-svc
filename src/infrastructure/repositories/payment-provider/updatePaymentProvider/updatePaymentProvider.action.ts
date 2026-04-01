import { UpdatePaymentProviderRequest, UpdatePaymentProviderResponse } from '@domain/models/payment-provider.model';
import { PaymentProviderEntity } from '@infrastructure/entities/payment-provider.entity';
import { QueryRunner } from 'typeorm';


export class UpdatePaymentProviderAction  extends UpdatePaymentProviderResponse {
  constructor(private readonly session: QueryRunner) {
    super();
  }
    
    public async execute(params: UpdatePaymentProviderRequest): Promise<UpdatePaymentProviderResponse|null> {
      try {
        await this.validateAndBuildParams(params);
        const updateModel = await this.prepareUpdateModel();
        const updatedEntity = await this.performUpdate(updateModel);
        await this.mapEntityToResponse(updatedEntity);

        return this.buildResponse();
      } catch (error) {
        console.error('ERROR UpdatePaymentProviderAction.execute', error?.message);
        throw error instanceof Error ? error : new Error(error?.message);
      }
    }


  /**
   * Validate and build parameters
   */
  private async validateAndBuildParams(params: UpdatePaymentProviderRequest): Promise<void> {
      try {
        this._id = params._id;
        if (params.name !== undefined) this.name = params.name;
        if (params.img !== undefined) this.img = params.img;
        if (params.amount !== undefined) this.amount = params.amount;
      } catch (error) {
        console.error('ERROR validateAndBuildParams', error?.message);
        throw new Error(`Failed to validate parameters: ${error?.message}`);
      }
    }


  /**
   * Prepare update model
   */
  private async prepareUpdateModel(): Promise<any> {
      try {
        return {
          _id: this._id,
          name: this.name,
          img: this.img,
          amount: this.amount,
        };
      } catch (error) {
        console.error('ERROR prepareUpdateModel', error?.message);
        throw new Error(`Failed to prepare update model: ${error?.message}`);
      }
    }


  /**
   * Perform database update and fetch updated entity
   */
  private async performUpdate(model: any): Promise<PaymentProviderEntity> {
      try {
        const condition = { _id: this._id };

        const result = await this.session.manager.update(PaymentProviderEntity, condition, model);
        
        if (result.affected === 0) {
          throw new Error("PaymentProvider not found or no changes made");
        }
        
        const updatedEntity = await this.session.manager.findOne(PaymentProviderEntity, {
          where: condition
        });
        
        if (!updatedEntity) {
          throw new Error("PaymentProvider not found after update");
        }

        return updatedEntity;
      } catch (error) {
        console.error('ERROR performUpdate', error?.message);
        throw new Error(`Failed to update payment-provider: ${error?.message}`);
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
  private buildResponse(): UpdatePaymentProviderResponse {
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