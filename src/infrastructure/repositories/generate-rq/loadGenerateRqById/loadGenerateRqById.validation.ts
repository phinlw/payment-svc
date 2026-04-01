import { LoadGenerateRqByIdRequest } from '@domain/models/generate-rq.model';
import { GenerateRqEntity } from '@infrastructure/entities/generate-rq.entity';
import { Repository } from 'typeorm';
export class LoadGenerateRqByIdValidation  extends LoadGenerateRqByIdRequest {
  constructor(private readonly generateRqRepository: Repository<GenerateRqEntity>) {
    super();
  }
  public async execute(params: LoadGenerateRqByIdRequest): Promise<any> {
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
  private async buildParams(params: LoadGenerateRqByIdRequest): Promise<string> {
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