import axios from 'axios';
import { GenerateQrRequest, GenerateQrResponse } from '@domain/models/generate-qr.model';
import { generateLdbHeaders, getLdbApiUrl, fetchAccessToken } from '@shared/utils/ldb-header.util';

export class GenerateQrAction {
  constructor() {}

  public async execute(params: GenerateQrRequest): Promise<GenerateQrResponse> {
    try {
      const accessToken = await fetchAccessToken();
      const apiHeaders = this.buildApiHeaders(params, accessToken);
      const apiUrl = this.buildApiUrl();
      const apiResponse = await this.callLdbApi(apiUrl, params, apiHeaders);
      console.log('apiResponse====>', apiResponse);
      

      return this.buildResponse(apiResponse);
    } catch (error) {
      console.error('ERROR GenerateQrAction.execute', error?.message);
      throw error instanceof Error ? error : new Error(error?.message || String(error));
    }
  }

  /**
   * Build API headers with digest and signature
   */
  private buildApiHeaders(body: GenerateQrRequest, accessToken: string): Record<string, string> {
    try {
      const headers = generateLdbHeaders(body, accessToken);
      return {
        'x-client-transaction-id': headers['x-client-transaction-id'],
        'x-client-Transaction-datetime': headers['x-client-Transaction-datetime'],
        partnerId: headers.partnerId,
        digest: headers.digest,
        signature: headers.signature,
        'Content-Type': headers['Content-Type'],
        Authorization: headers.Authorization,
      };
    } catch (error) {
      console.error('ERROR buildApiHeaders', error?.message);
      throw new Error(`Failed to build API headers: ${error?.message || String(error)}`);
    }
  }

  /**
   * Build API URL
   */
  private buildApiUrl(): string {
    try {
      const url = getLdbApiUrl();
      if (!url) {
        throw new Error('LDB_URL is not configured');
      }
      return url;
    } catch (error) {
      console.error('ERROR buildApiUrl', error?.message);
      throw new Error(`Failed to build API URL: ${error?.message || String(error)}`);
    }
  }

  /**
   * Call LDB API
   */
  private async callLdbApi(
    url: string,
    body: GenerateQrRequest,
    headers: Record<string, string>,
  ): Promise<any> {
    try {
      const response = await axios.post(url, JSON.stringify(body), {
        headers,
      });
      return response.data;
    } catch (error) {
      console.error('ERROR callLdbApi', error?.message);
      const errorMessage = error?.response?.data
        ? JSON.stringify(error.response.data)
        : error?.message || String(error);
      throw new Error(`LDB API request failed: ${errorMessage}`);
    }
  }

  /**
   * Build response object
   */
  private buildResponse(apiResponse: any): GenerateQrResponse {
    try {
      return {
        success: true,
        apiResponse,
      };
    } catch (error) {
      console.error('ERROR buildResponse', error?.message);
      throw new Error(`Failed to build response: ${error?.message || String(error)}`);
    }
  }
}
