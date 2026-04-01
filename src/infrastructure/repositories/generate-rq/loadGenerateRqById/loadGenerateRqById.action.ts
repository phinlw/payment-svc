import { LoadGenerateRqByIdRequest, LoadGenerateRqByIdResponse } from '@domain/models/generate-rq.model';
import { GenerateRqEntity } from '@infrastructure/entities/generate-rq.entity';
import { QueryRunner } from 'typeorm';


export class LoadGenerateRqByIdAction  extends LoadGenerateRqByIdResponse {
  constructor(private readonly session: QueryRunner) {
    super();
  }


  public async execute(params: LoadGenerateRqByIdRequest): Promise<LoadGenerateRqByIdResponse|null> {
    try {
        await this.validateParams(params);
        const entity = await this.fetchGenerateRqById();
        await this.mapEntityToResponse(entity);


        return this.buildResponse();
      } catch (error) {
        console.error('ERROR LoadGenerateRqByIdAction.execute', error?.message);
        throw error instanceof Error ? error : new Error(error?.message);
      }
    }


  /**
   * Validate parameters
   */
  private async validateParams(params: LoadGenerateRqByIdRequest): Promise<void> { 
      try {
        if (!params._id) {
          throw new Error('GenerateRq ID is required');
        }
        this._id = params._id;
      } catch (error) {
        console.error('ERROR validateParams', error?.message);
        throw new Error(`Failed to validate parameters: ${error?.message}`);
      }
    }


  /**
   * Fetch generate-rq entity from database
   */
  private async fetchGenerateRqById(): Promise<GenerateRqEntity> {
      try {
        const condition = {
          where: {
            _id: this._id,
          },
        };


        const entity = await this.session.manager.findOne(GenerateRqEntity, condition);


        if (!entity) {
          throw new Error('GenerateRq not found');
        }


        return entity;
      }
      catch (error) {
        console.error('ERROR fetchGenerateRqById', error?.message);
        throw new Error(`Failed to fetch generate-rq: ${error?.message}`);
      }
    }


  /**
   * Map entity to response properties
   */
  private async mapEntityToResponse(entity: GenerateRqEntity): Promise<void> {
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
  private buildResponse(): LoadGenerateRqByIdResponse {
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