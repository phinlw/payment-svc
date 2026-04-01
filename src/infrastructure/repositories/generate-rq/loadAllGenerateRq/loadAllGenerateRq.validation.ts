import { LoadAllGenerateRqRequest } from '@domain/models/generate-rq.model';
import { GenerateRqEntity } from '@infrastructure/entities/generate-rq.entity';
import { Repository } from 'typeorm';
export class LoadAllGenerateRqValidation  extends LoadAllGenerateRqRequest {
  constructor(private readonly generateRqRepository: Repository<GenerateRqEntity>) {
    super();
  }

  public async execute(params: LoadAllGenerateRqRequest): Promise<any> {
      try {
        await this.InitParams(params);
        await this.ValidateParams();

        const response = {};
        return response;
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }

  private async InitParams(params: LoadAllGenerateRqRequest): Promise<string> {
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