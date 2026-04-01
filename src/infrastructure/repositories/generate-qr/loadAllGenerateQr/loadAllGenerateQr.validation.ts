import { LoadAllGenerateQrRequest } from '@domain/models/generate-qr.model';
import { GenerateQrEntity } from '@infrastructure/entities/generate-qr.entity';
import { Repository } from 'typeorm';
export class LoadAllGenerateQrValidation  extends LoadAllGenerateQrRequest {
  constructor(private readonly generateQrRepository: Repository<GenerateQrEntity>) {
    super();
  }

  public async execute(params: LoadAllGenerateQrRequest): Promise<any> {
      try {
        await this.InitParams(params);
        await this.ValidateParams();

        const response = {};
        return response;
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }

  private async InitParams(params: LoadAllGenerateQrRequest): Promise<string> {
      try {
        this.name = params.name;
        return 'InitParams completed';
      } catch (error) {
        console.log('ERROR InitParams', error?.message);
        throw error instanceof Error ? error : new Error(error?.message);
      }
    }
  private async ValidateParams(): Promise<string> {
      try {
        if (!this.name) {
          throw new Error('Invalid params');
        }

        return 'ValidateParams completed';
      } catch (error) {
        console.log('ERROR ValidateParams', error?.message);
        throw error instanceof Error ? error : new Error(error?.message);
      }
    }
  }