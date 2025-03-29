#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('path');

// Configuration
const SRC_DIR = path.resolve(__dirname, '../src');
const COMPONENT_SIZE_LIMIT = 200;
const FUNCTION_SIZE_LIMIT = 30;
const COMPONENT_EXTENSIONS = ['.tsx', '.jsx', '.ts', '.js'];

// Data structures to store results
const oversizedComponents = [];
const oversizedFunctions = [];

// Helper to check if a file is a potential React component
function isPotentialReactComponent(filePath) {
  const ext = path.extname(filePath);
  return COMPONENT_EXTENSIONS.includes(ext);
}

// Function to count lines in a file
async function countLines(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  return content.split('\n').length;
}

// Function to analyze a single file
async function analyzeFile(filePath) {
  try {
    const lineCount = await countLines(filePath);
    const relativePath = path.relative(SRC_DIR, filePath);
    
    if (lineCount > COMPONENT_SIZE_LIMIT) {
      oversizedComponents.push({
        path: relativePath,
        lineCount,
        limit: COMPONENT_SIZE_LIMIT,
        exceededBy: lineCount - COMPONENT_SIZE_LIMIT,
      });
    }
    
    // Basic function analysis (will not be perfect without proper parsing)
    const content = await fs.readFile(filePath, 'utf8');
    
    // Very simple regex-based function detection (not accurate for all cases)
    const functionRegex = /function\s+(\w+)?\s*\(.*?\)\s*{|(\w+)\s*=\s*function\s*\(.*?\)\s*{|(\w+)\s*=\s*\(.*?\)\s*=>\s*{|(\w+)\s*\(.*?\)\s*{/g;
    
    let match;
    while ((match = functionRegex.exec(content)) !== null) {
      const functionName = match[1] || match[2] || match[3] || match[4] || 'anonymous';
      const functionStart = content.substring(0, match.index).split('\n').length;
      
      // Find the closing brace (this is a simplistic approach)
      let braceCount = 1;
      let endIndex = match.index + match[0].length;
      
      while (braceCount > 0 && endIndex < content.length) {
        if (content[endIndex] === '{') braceCount++;
        if (content[endIndex] === '}') braceCount--;
        endIndex++;
      }
      
      const functionEnd = content.substring(0, endIndex).split('\n').length;
      const functionLineCount = functionEnd - functionStart;
      
      if (functionLineCount > FUNCTION_SIZE_LIMIT) {
        oversizedFunctions.push({
          path: relativePath,
          functionName,
          lineCount: functionLineCount,
          limit: FUNCTION_SIZE_LIMIT,
          exceededBy: functionLineCount - FUNCTION_SIZE_LIMIT,
          startLine: functionStart,
          endLine: functionEnd,
        });
      }
    }
  } catch (error) {
    console.error(`Error analyzing file ${filePath}:`, error);
  }
}

// Function to recursively scan directories
async function scanDirectory(dirPath) {
  try {
    const items = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item.name);
      
      if (item.isDirectory()) {
        await scanDirectory(itemPath);
      } else if (item.isFile() && isPotentialReactComponent(item.name)) {
        await analyzeFile(itemPath);
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error);
  }
}

// Main function
async function main() {
  try {
    console.log(`Analyzing components in ${SRC_DIR}...`);
    console.log(`Component size limit: ${COMPONENT_SIZE_LIMIT} lines`);
    console.log(`Function size limit: ${FUNCTION_SIZE_LIMIT} lines`);
    
    await scanDirectory(SRC_DIR);
    
    // Sort results by exceeded lines
    oversizedComponents.sort((a, b) => b.exceededBy - a.exceededBy);
    oversizedFunctions.sort((a, b) => b.exceededBy - a.exceededBy);
    
    // Generate report
    console.log(`\nFound ${oversizedComponents.length} components exceeding ${COMPONENT_SIZE_LIMIT} lines.`);
    console.log(`Found ${oversizedFunctions.length} functions exceeding ${FUNCTION_SIZE_LIMIT} lines.`);
    
    // Make sure the reports directory exists
    const REPORTS_DIR = path.resolve(__dirname, '../reports');
    try {
      await fs.mkdir(REPORTS_DIR, { recursive: true });
    } catch (error) {
      // Directory already exists or cannot be created
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
    
    // Write results to a JSON file
    const reportPath = path.resolve(REPORTS_DIR, 'component-size-analysis.json');
    await fs.writeFile(
      reportPath,
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          oversizedComponents,
          oversizedFunctions,
          componentSizeLimit: COMPONENT_SIZE_LIMIT,
          functionSizeLimit: FUNCTION_SIZE_LIMIT,
        },
        null,
        2
      )
    );
    
    console.log(`\nAnalysis complete. See ${reportPath} for details.`);
    
    // Print top 10 oversized components
    if (oversizedComponents.length > 0) {
      console.log('\nTop 10 oversized components:');
      oversizedComponents.slice(0, 10).forEach((comp, i) => {
        console.log(`${i + 1}. ${comp.path} (${comp.lineCount} lines, exceeds by ${comp.exceededBy})`);
      });
    }
    
    // Print top 10 oversized functions
    if (oversizedFunctions.length > 0) {
      console.log('\nTop 10 oversized functions:');
      oversizedFunctions.slice(0, 10).forEach((func, i) => {
        console.log(`${i + 1}. ${func.path}:${func.functionName} (${func.lineCount} lines, exceeds by ${func.exceededBy})`);
      });
    }
  } catch (error) {
    console.error('Error during analysis:', error);
    process.exit(1);
  }
}

main();
