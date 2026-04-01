import { DeleteGenerateRqRequest } from '@domain/models/generate-rq.model';
import { GenerateRqEntity } from '@infrastructure/entities/generate-rq.entity';
import { Repository } from 'typeorm';
export class DeleteGenerateRqValidation  extends DeleteGenerateRqRequest { 

  constructor(private readonly generateRqRepository: Repository<GenerateRqEntity>) {
    super();
  }

  public async execute(params: DeleteGenerateRqRequest): Promise<DeleteGenerateRqRequest> {
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

  private async buildParams(params: DeleteGenerateRqRequest): Promise<string> { 
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