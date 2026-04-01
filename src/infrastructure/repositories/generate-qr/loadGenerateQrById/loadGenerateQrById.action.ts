import { LoadGenerateQrByIdRequest, LoadGenerateQrByIdResponse } from '@domain/models/generate-qr.model';
import { GenerateQrEntity } from '@infrastructure/entities/generate-qr.entity';
import { QueryRunner } from 'typeorm';


export class LoadGenerateQrByIdAction  extends LoadGenerateQrByIdResponse {
  constructor(private readonly session: QueryRunner) {
    super();
  }


  public async execute(params: LoadGenerateQrByIdRequest): Promise<LoadGenerateQrByIdResponse|null> {
    try {
        await this.validateParams(params);
        const entity = await this.fetchGenerateQrById();
        await this.mapEntityToResponse(entity);


        return this.buildResponse();
      } catch (error) {
        console.error('ERROR LoadGenerateQrByIdAction.execute', error?.message);
        throw error instanceof Error ? error : new Error(error?.message);
      }
    }


  /**
   * Validate parameters
   */
  private async validateParams(params: LoadGenerateQrByIdRequest): Promise<void> { 
      try {
        if (!params._id) {
          throw new Error('GenerateQr ID is required');
        }
        this._id = params._id;
      } catch (error) {
        console.error('ERROR validateParams', error?.message);
        throw new Error(`Failed to validate parameters: ${error?.message}`);
      }
    }


  /**
   * Fetch generate-qr entity from database
   */
  private async fetchGenerateQrById(): Promise<GenerateQrEntity> {
      try {
        const condition = {
          where: {
            _id: this._id,
          },
        };


        const entity = await this.session.manager.findOne(GenerateQrEntity, condition);


        if (!entity) {
          throw new Error('GenerateQr not found');
        }


        return entity;
      }
      catch (error) {
        console.error('ERROR fetchGenerateQrById', error?.message);
        throw new Error(`Failed to fetch generate-qr: ${error?.message}`);
      }
    }


  /**
   * Map entity to response properties
   */
  private async mapEntityToResponse(entity: GenerateQrEntity): Promise<void> {
      try {
        this._id = entity._id;
        this.uniqueId = entity.uniqueId;
        this.userId=entity.userId;
        this.amount=entity.amount;
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
  private buildResponse(): LoadGenerateQrByIdResponse {
      try {
        return {
          _id: this._id,
          userId: this.userId,
          amount: this.amount,
          uniqueId: this.uniqueId,
          isActive: this.isActive,
          createdAt: this.createdAt,
          updatedAt: this.updatedAt,
        };
      } catch (error) {
        console.error('ERROR buildResponse', error?.message);
        throw new Error(`Failed to build response: ${error?.message}`);
      }
    }
}