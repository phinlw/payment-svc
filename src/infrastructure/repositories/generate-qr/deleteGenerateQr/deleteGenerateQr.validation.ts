import { DeleteGenerateQrRequest } from '@domain/models/generate-qr.model';
import { GenerateQrEntity } from '@infrastructure/entities/generate-qr.entity';
import { Repository } from 'typeorm';
export class DeleteGenerateQrValidation  extends DeleteGenerateQrRequest { 

  constructor(private readonly generateQrRepository: Repository<GenerateQrEntity>) {
    super();
  }

  public async execute(params: DeleteGenerateQrRequest): Promise<DeleteGenerateQrRequest> {
      try {
        await this.buildParams(params);
        await this.validateParams();

        const response = {
        _id: this._id,
        };
        return response;
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }

  private async buildParams(params: DeleteGenerateQrRequest): Promise<string> { 
    try {
        this._id = params._id;
        return 'InitParams completed';
      } catch (error) {
        console.log('ERROR InitParams', error?.message);
        throw error instanceof Error ? error : new Error(error?.message);
      }
    }
  private async validateParams(): Promise<string> {
      try {
        if (!this._id) {
          throw new Error('Invalid params');
        }

        return 'ValidateParams completed';
      } catch (error) {
        console.log('ERROR ValidateParams', error?.message);
        throw error instanceof Error ? error : new Error(error?.message);
      }
    }
  }