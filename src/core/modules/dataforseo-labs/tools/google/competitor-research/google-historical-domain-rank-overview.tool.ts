import { z } from 'zod';
import { DataForSEOClient } from '../../../../../client/dataforseo.client.js';
import { BaseTool, DataForSEOResponse } from '../../../../base.tool.js';

export class GoogleHistoricalDomainRankOverviewTool extends BaseTool {
  constructor(client: DataForSEOClient) {
    super(client);
  }

  getName(): string {
    return 'dataforseo_labs_google_historical_rank_overview';
  }

  getDescription(): string {
    return `This endpoint will provide you with historical data on rankings and traffic of the specified domain, such as domain ranking distribution in SERPs and estimated monthly traffic volume for both organic and paid results`;
  }

  getTitle(): string {
    return 'DataForSEO Labs Google Historical Rank Overview';
  }

  getParams(): z.ZodRawShape {
    return {
      target: z.string().describe(`target domain`),
      location_name: z.string().default("United States").describe(`full name of the location
required field
only in format "Country" (not "City" or "Region")
example:
'United Kingdom', 'United States', 'Canada'`),
      language_code: z.string().default("en").describe(
        `language code
        required field
        example:
        en`),
      ignore_synonyms: z.boolean().default(true).describe(
          `ignore highly similar keywords, if set to true, results will be more accurate`),        
      include_clickstream_data: z.boolean().optional().default(false).describe(
        `Include or exclude data from clickstream-based metrics in the result`),
      date_from: z.string().optional().describe(
        `starting date of the time range
optional field
if you don't specify this field, the data will be provided for the previous 6 months
minimal possible value: 2020-10-01
date format: "yyyy-mm-dd"
example:
"2021-01-01"`),
      date_to: z.string().optional().describe(
        `ending date of the time range
optional field
if you don't specify this field, the today's date will be used by default
date format: "yyyy-mm-dd"
example:
"2021-04-01"`)
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.dataForSEOClient.makeRequest('/v3/dataforseo_labs/google/historical_rank_overview/live', 'POST', [{
        target: params.target,
        location_name: params.location_name,
        language_code: params.language_code,
        ignore_synonyms: params.ignore_synonyms,
        include_clickstream_data: params.include_clickstream_data,
        date_from: params.date_from,
        date_to: params.date_to
      }]);
      return this.validateAndFormatResponse(response);

    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
} 