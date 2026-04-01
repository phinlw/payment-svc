import { createQueryProps, executeQuery } from '@/shared/utils/query';
import { QueryProps } from '@domain/models/query.model';
import { LoadAllGenerateQrResponse, ResponseGenerateQrModel } from '@domain/models/generate-qr.model';
import { GenerateQrEntity } from '@infrastructure/entities/generate-qr.entity';
import { QueryRunner } from 'typeorm';


export class LoadAllGenerateQrAction  extends LoadAllGenerateQrResponse {


  constructor(private readonly session: QueryRunner) {
    super();
  }


  public async execute(query: QueryProps): Promise<LoadAllGenerateQrResponse> {
      try {
        const queryProps = await this.buildQueryParams(query);
        const { data, total } = await this.fetchGenerateQrData(queryProps);
        const transformedData = await this.transformEntities(data);


        return this.buildResponse(transformedData, total);
      } catch (error) {
        console.error('ERROR LoadAllGenerateQrAction.execute', error?.message);
        throw error instanceof Error ? error : new Error(error?.message);
      }
    }


  /**
   * Build and validate query parameters
   */
  private async buildQueryParams(query: QueryProps): Promise<any> {
      try {
        const queryProps = createQueryProps(query);
        return queryProps;
      } catch (error) {
        console.error('ERROR buildQueryParams', error?.message);
        throw new Error(`Failed to build query parameters: ${error?.message}`);
      }
    }


  /**
   * Fetch data from database
   */
  private async fetchGenerateQrData(queryProps: any): Promise<{ data: GenerateQrEntity[], total: number }> {
      try {
        const repository = this.session.manager.getRepository(GenerateQrEntity);
        const { data, total } = await executeQuery(repository, queryProps);
        
        return { data, total };
      } catch (error) {
        console.error('ERROR fetchGenerateQrData', error?.message);
        throw new Error(`Failed to fetch data: ${error?.message}`);
      }
    }


  /**
   * Transform entities to response models
   * Optimized for large datasets with batch processing
   */
  private async transformEntities(entities: GenerateQrEntity[]): Promise<ResponseGenerateQrModel[]> {
      try {
        if (!entities || entities.length === 0) {
          return [];
        }


        // For large datasets, process in chunks to avoid memory issues
        const CHUNK_SIZE = 100;
        const result: ResponseGenerateQrModel[] = [];


        for (let i = 0; i < entities.length; i += CHUNK_SIZE) {
          const chunk = entities.slice(i, i + CHUNK_SIZE);
          const transformedChunk = chunk.map(entity => this.mapEntityToModel(entity));
          result.push(...transformedChunk);
        }


        return result;
      } catch (error) {
        console.error('ERROR transformEntities', error?.message);
        throw new Error(`Failed to transform entities: ${error?.message}`);
      }
    }


  /**
   * Helper: Map single entity to response model
   */
  private mapEntityToModel(entity: GenerateQrEntity): ResponseGenerateQrModel {
      return {
        _id: entity._id,
        uniqueId: entity.uniqueId,
        userId: entity.userId,
        amount: entity.amount,
        isActive: entity.isActive,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      };
    }


  /**
   * Build final response
   */
  private buildResponse(items: ResponseGenerateQrModel[], total: number): LoadAllGenerateQrResponse {
      try {
        this.items = items;
        this.total = total;


        return {
          items,
          total,
        };
      } catch (error) {
        console.error('ERROR buildResponse', error?.message);
        throw new Error(`Failed to build response: ${error?.message}`);
      }
    }
}