import { UpdateGenerateRqRequest, UpdateGenerateRqResponse } from '@domain/models/generate-rq.model';
import { GenerateRqEntity } from '@infrastructure/entities/generate-rq.entity';
import { QueryRunner } from 'typeorm';


export class UpdateGenerateRqAction  extends UpdateGenerateRqResponse {
  constructor(private readonly session: QueryRunner) {
    super();
  }
    
    public async execute(params: UpdateGenerateRqRequest): Promise<UpdateGenerateRqResponse|null> {
      try {
        await this.validateAndBuildParams(params);
        const updateModel = await this.prepareUpdateModel();
        const updatedEntity = await this.performUpdate(updateModel);
        await this.mapEntityToResponse(updatedEntity);

        return this.buildResponse();
      } catch (error) {
        console.error('ERROR UpdateGenerateRqAction.execute', error?.message);
        throw error instanceof Error ? error : new Error(error?.message);
      }
    }


  /**
   * Validate and build parameters
   */
  private async validateAndBuildParams(params: UpdateGenerateRqRequest): Promise<void> {
      try {
        this._id = params._id;
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
        };
      } catch (error) {
        console.error('ERROR prepareUpdateModel', error?.message);
        throw new Error(`Failed to prepare update model: ${error?.message}`);
      }
    }


  /**
   * Perform database update and fetch updated entity
   */
  private async performUpdate(model: any): Promise<GenerateRqEntity> {
      try {
        const condition = { _id: this._id };

        const result = await this.session.manager.update(GenerateRqEntity, condition, model);
        
        if (result.affected === 0) {
          throw new Error("GenerateRq not found or no changes made");
        }
        
        const updatedEntity = await this.session.manager.findOne(GenerateRqEntity, {
          where: condition
        });
        
        if (!updatedEntity) {
          throw new Error("GenerateRq not found after update");
        }

        return updatedEntity;
      } catch (error) {
        console.error('ERROR performUpdate', error?.message);
        throw new Error(`Failed to update generate-rq: ${error?.message}`);
      }
    }


  /**
   * Map entity to response properties
   */
  private async mapEntityToResponse(entity: GenerateRqEntity): Promise<void> {
      try {
        this._id = entity._id;
        this.uniqueId = entity.uniqueId;
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
  private buildResponse(): UpdateGenerateRqResponse {
      try {
        return {
          _id: this._id,
          uniqueId: this.uniqueId,
          isActive: this.isActive,
          createdAt: this.createdAt,
          updatedAt: this.updatedAt,
          userId: this.userId,
          amount: this.amount,
        };
      } catch (error) {
        console.error('ERROR buildResponse', error?.message);
        throw new Error(`Failed to build response: ${error?.message}`);
      }
    }
  }