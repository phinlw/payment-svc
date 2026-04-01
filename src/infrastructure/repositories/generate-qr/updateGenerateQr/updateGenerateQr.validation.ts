import { validateMultiple, validateText } from '@/shared/utils/base.util';
import { UpdateGenerateQrRequest, UpdateGenerateQrResponse } from '@domain/models/generate-qr.model';
import { GenerateQrEntity } from '@infrastructure/entities/generate-qr.entity';
import { Repository } from 'typeorm';
export class UpdateGenerateQrValidation extends UpdateGenerateQrRequest {
  constructor(private readonly generateQrRepository: Repository<GenerateQrEntity>) {
    super();
  }

  public async execute(params: UpdateGenerateQrRequest): Promise<UpdateGenerateQrRequest> {
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
  private async buildParams(params: UpdateGenerateQrRequest): Promise<string> {
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