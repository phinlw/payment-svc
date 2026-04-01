import { validateMultiple, validateText } from '@/shared/utils/base.util';
import { UpdateGenerateRqRequest, UpdateGenerateRqResponse } from '@domain/models/generate-rq.model';
import { GenerateRqEntity } from '@infrastructure/entities/generate-rq.entity';
import { Repository } from 'typeorm';
export class UpdateGenerateRqValidation extends UpdateGenerateRqRequest {
  constructor(private readonly generateRqRepository: Repository<GenerateRqEntity>) {
    super();
  }

  public async execute(params: UpdateGenerateRqRequest): Promise<UpdateGenerateRqRequest> {
      try {
        await this.buildParams(params);
        await this.validateParams();

        const response = {
         name: this.name,
          _id: this._id,
        };
        return response;
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }
  private async buildParams(params: UpdateGenerateRqRequest): Promise<string> {
      try {
        this.name = params.name;
        this._id = params._id;

        return 'BuildParams completed';
      } catch (error) {
        console.log('ERROR BuildParams', error?.message);
        throw error instanceof Error ? error : new Error(error?.message);
      }
    }
  private async validateParams(): Promise<string> {
      try {
        const validationResults = validateMultiple({
          name: validateText(this.name, { 
            required: true, 
            minLength: 2, 
            maxLength: 100,
            allowEmpty: false 
          })
        });

        // Check if validation failed
        if (!validationResults.isValid) {
          const errorMessages = Object.entries(validationResults.errors)
            .map(([field, message]) => `${field}: ${message}`)
            .join(', ');
          throw new Error(`Validation failed: ${errorMessages}`);
        }
        return 'ValidateParams completed';
      } catch (error) {
        console.log('ERROR ValidateParams', error?.message);
        throw error instanceof Error ? error : new Error(error?.message);
      }
    }
  }