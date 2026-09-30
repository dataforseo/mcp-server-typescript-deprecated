import { defaultGlobalToolConfig } from '../config/global.tool.js';
import { version } from '../utils/version.js';
import { resolveOutboundUserAgent } from './user-agent.js';

export class DataForSEOClient {
  private config: DataForSEOConfig;
  private productUserAgent: string;

  constructor(config: DataForSEOConfig) {
    this.config = config;
    if (defaultGlobalToolConfig.debug) {
      console.error('DataForSEOClient initialized with config:', config);
    }
    this.productUserAgent = `DataForSEO-MCP-TypeScript-SDK/${version}`;
  }

  async makeRequest<T>(endpoint: string, method: string = 'POST', body?: any, forceFull: boolean = false): Promise<T> {
    let url = `${this.config.baseUrl || "https://api.dataforseo.com"}${endpoint}`;
    if(!defaultGlobalToolConfig.fullResponse && !forceFull){
      url += '.ai';
    }

    const headers = {
      'Authorization': this.config.authHeader,
      'Content-Type': 'application/json',
      'User-Agent': resolveOutboundUserAgent(this.productUserAgent)
    };

    if(defaultGlobalToolConfig.debug) {
      console.error(`Making request to ${url} with method ${method} and body`, body);
    }
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export interface DataForSEOConfig {
  authHeader: string;
  baseUrl?: string;
}

export function buildBasicAuthHeader(username: string, password: string): string {
  return `Basic ${btoa(`${username}:${password}`)}`;
}
