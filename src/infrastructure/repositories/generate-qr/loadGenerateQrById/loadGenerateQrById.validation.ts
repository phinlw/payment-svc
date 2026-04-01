import { LoadGenerateQrByIdRequest } from '@domain/models/generate-qr.model';
import { GenerateQrEntity } from '@infrastructure/entities/generate-qr.entity';
import { Repository } from 'typeorm';
export class LoadGenerateQrByIdValidation  extends LoadGenerateQrByIdRequest {
  constructor(private readonly generateQrRepository: Repository<GenerateQrEntity>) {
    super();
  }
  public async execute(params: LoadGenerateQrByIdRequest): Promise<any> {
      try {
        await this.buildParams(params);
        await this.validateParams();

        const response = {
          _id: this._id
          };
        return response;
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }
  private async buildParams(params: LoadGenerateQrByIdRequest): Promise<string> {
    try {
        this._id = params._id;
        return 'BuildParams completed';
      } catch (error) {
        console.log('ERROR BuildParams', error?.message);
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