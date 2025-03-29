/**
 * Generate API Script
 * 
 * This script generates TypeScript interfaces and API clients from
 * the OpenAPI specification using openapi-typescript-codegen.
 * 
 * Usage:
 * ```
 * npm run openapi:generate
 * ```
 */ 

import fs from 'fs';
import path from 'path';
import { generate } from 'openapi-typescript-codegen';
import { argv } from 'process';

// Default OpenAPI spec file location
const DEFAULT_SPEC_PATH = path.join(__dirname, '..', 'openapi.json');

// Default output directory for generated code
const DEFAULT_OUTPUT_DIR = path.join(__dirname, '..', 'generated');

async function generateApi() {
  try {
    // Get spec file path from command line args or use default
    const specPath = argv[2] || DEFAULT_SPEC_PATH;
    // Get output directory from command line args or use default
    const outputDir = argv[3] || DEFAULT_OUTPUT_DIR;

    console.log(`Reading OpenAPI spec from: ${specPath}`);
    
    // Ensure spec file exists
    if (!fs.existsSync(specPath)) {
      throw new Error(`OpenAPI spec file not found at ${specPath}`);
    }
    
    // Read and parse spec file
    const openApiSpec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
    
    console.log(`Generating API client to: ${outputDir}`);
    
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Generate API client
    await generate({
      input: openApiSpec,
      output: outputDir,
      httpClient: 'axios',
      useOptions: true,
      useUnionTypes: true,
      exportCore: true,
      exportServices: true,
      exportModels: true,
      exportSchemas: false,
      indent: '  ',
      request: './api-client.ts',
    });
    
    // Create index.ts file to export all generated types and clients
    createIndexFile(outputDir);
    
    // Create custom API client adapter
    createApiClient(outputDir);
    
    console.log('API client generated successfully!');
    return true;
  } catch (error) {
    console.error('Error generating API client:', error.message);
    return false;
  }
}

function createIndexFile(outputDir) {
  console.log('Creating index.ts file for the generated code...');
  
  const indexPath = path.join(outputDir, 'index.ts');
  const content = `/**
 * Generated API Client and Types
 * 
 * This file exports all generated types and API clients.
 * DO NOT MODIFY THIS FILE MANUALLY.
 * 
 * To update: 
 * 1. Run \`npm run openapi:fetch\` to fetch the latest OpenAPI spec
 * 2. Run \`npm run openapi:generate\` to regenerate this code
 */

// Export all models (types)
export * from './models';

// Export all services (API clients)
export * from './services';

// Export core functionality
export * from './core';
`;
  
  fs.writeFileSync(indexPath, content);
}

function createApiClient(outputDir) {
  console.log('Creating custom API client adapter...');
  
  const clientPath = path.join(outputDir, 'api-client.ts');
  const content = `/**
 * Custom API Client
 * 
 * This file provides a custom implementation of the OpenAPI client
 * that integrates with our application's API handling.
 * 
 * DO NOT MODIFY THIS FILE MANUALLY.
 */

import axios from 'axios';
import type { 
  OpenAPIConfig, 
  ApiRequestOptions,
  ApiResult 
} from './core/OpenAPI';
import { apiClient } from '../core';

export const request = <T>(config: OpenAPIConfig, options: ApiRequestOptions): Promise<ApiResult<T>> => {
  // Use our existing API client instead of creating a new one
  return apiClient.request({
    url: options.path,
    method: options.method,
    data: options.body,
    params: options.query,
    headers: options.headers,
  }) as Promise<ApiResult<T>>;
};
`;
  
  fs.writeFileSync(clientPath, content);
}

// Run the generate function if this script is executed directly
if (require.main === module) {
  generateApi();
}

export default generateApi;