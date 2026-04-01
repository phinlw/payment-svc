import { DeleteGenerateQrRequest, DeleteGenerateQrResponse } from '@domain/models/generate-qr.model';
import { GenerateQrEntity } from '@infrastructure/entities/generate-qr.entity';
import { QueryRunner } from 'typeorm';
export class DeleteGenerateQrAction  extends DeleteGenerateQrResponse {
  constructor(private readonly session: QueryRunner) {
    super();
  }
  public async execute(params: DeleteGenerateQrRequest): Promise<DeleteGenerateQrResponse|null> {
      try {
        await this.buildParams(params);
        await this.DeleteGenerateQr();

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

  private async buildParams(params: DeleteGenerateQrRequest): Promise<string> {
      try {
        this._id = params._id;
        return 'BuildParams completed';
      } catch (error) {
        console.log('ERROR BuildParams', error?.message);
        throw error instanceof Error ? error : new Error(error?.message);
      }
    }
  private async DeleteGenerateQr(): Promise<string> {
      try {
        const condition = {
          _id: this._id,
        };

        await this.session.manager.update(GenerateQrEntity, condition, { isActive: false });

        return "GenerateQr deleted successfully";
      } catch (error) {
        console.log('ERROR Delete', error?.message);
        throw error instanceof Error ? error : new Error(error?.message);
      }
    }
}