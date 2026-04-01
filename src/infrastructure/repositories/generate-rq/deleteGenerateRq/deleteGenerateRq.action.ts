import { DeleteGenerateRqRequest, DeleteGenerateRqResponse } from '@domain/models/generate-rq.model';
import { GenerateRqEntity } from '@infrastructure/entities/generate-rq.entity';
import { QueryRunner } from 'typeorm';
export class DeleteGenerateRqAction  extends DeleteGenerateRqResponse {
  constructor(private readonly session: QueryRunner) {
    super();
  }
  public async execute(params: DeleteGenerateRqRequest): Promise<DeleteGenerateRqResponse|null> {
      try {
        await this.buildParams(params);
        await this.DeleteGenerateRq();

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

  private async buildParams(params: DeleteGenerateRqRequest): Promise<string> {
      try {
        this._id = params._id;
        return 'BuildParams completed';
      } catch (error) {
        console.log('ERROR BuildParams', error?.message);
        throw error instanceof Error ? error : new Error(error?.message);
      }
    }
  private async DeleteGenerateRq(): Promise<string> {
      try {
        const condition = {
          _id: this._id,
        };

        await this.session.manager.update(GenerateRqEntity, condition, { isActive: false });

        return "GenerateRq deleted successfully";
      } catch (error) {
        console.log('ERROR Delete', error?.message);
        throw error instanceof Error ? error : new Error(error?.message);
      }
    }
}