/**
 * Fetch OpenAPI Script
 * 
 * This script fetches the OpenAPI specification from the backend API
 * and saves it to a local file for code generation.
 * 
 * Usage:
 * ```
 * npm run openapi:fetch
 * ```
 */ 

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { argv } from 'process';

// Default API URL to fetch the OpenAPI spec from
const DEFAULT_API_URL = 'http://localhost:8080/v3/api-docs';

// Default output location for the OpenAPI spec
const DEFAULT_OUTPUT_PATH = path.join(__dirname, '..', 'openapi.json');

async function fetchOpenAPI() {
  try {
    // Get API URL from command line args or use default
    const apiUrl = argv[2] || DEFAULT_API_URL;
    // Get output path from command line args or use default
    const outputPath = argv[3] || DEFAULT_OUTPUT_PATH;

    console.log(`Fetching OpenAPI spec from: ${apiUrl}`);
    
    const response = await axios.get(apiUrl);
    const openApiSpec = response.data;

    console.log(`Writing OpenAPI spec to: ${outputPath}`);
    
    // Ensure directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write OpenAPI spec to file
    fs.writeFileSync(outputPath, JSON.stringify(openApiSpec, null, 2));
    
    console.log('OpenAPI spec fetched and saved successfully!');
    return true;
  } catch (error) {
    console.error('Error fetching OpenAPI spec:', error.message);
    return false;
  }
}

// Run the fetch function if this script is executed directly
if (require.main === module) {
  fetchOpenAPI();
}

export default fetchOpenAPI;