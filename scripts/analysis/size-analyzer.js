/**
 * Component Size Analyzer
 * 
 * This script analyzes the codebase to identify files that exceed
 * the size limitations defined in our architecture principles:
 * - Components: 200 lines maximum
 * - Functions: 30 lines maximum (estimated by indentation patterns)
 * 
 * Usage:
 * node scripts/analysis/size-analyzer.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  componentMaxLines: 200,
  functionMaxLines: 30,
  rootDir: path.resolve(__dirname, '../../src'),
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  exclude: ['node_modules', '.next', 'build', 'public', '.git', 'test', 'tests', '__tests__', '__snapshots__'],
  outputPath: path.resolve(__dirname, './size-report.json'),
};

// Results
const results = {
  largeFiles: [],
  timestamp: new Date().toISOString(),
};

// Counter for progress
let filesProcessed = 0;

/**
 * Check if a path should be excluded
 */
function shouldExclude(filePath) {
  return CONFIG.exclude.some(excludePattern => filePath.includes(excludePattern));
}

/**
 * Check if a file has a valid extension
 */
function hasValidExtension(filePath) {
  const ext = path.extname(filePath);
  return CONFIG.extensions.includes(ext);
}

/**
 * Check if a file is likely a React component (capital first letter, JSX/TSX, or contains React imports)
 */
function isLikelyComponent(filePath, content) {
  const fileName = path.basename(filePath, path.extname(filePath));
  const isComponentName = /^[A-Z][a-zA-Z0-9]*$/.test(fileName);
  const hasReactImport = content.includes('import React') || content.includes('from "react"') || content.includes('from \'react\'');
  const hasJsxSyntax = content.includes('<') && content.includes('/>') || content.includes('</');
  
  return isComponentName && (hasReactImport || hasJsxSyntax);
}

/**
 * Estimate function sizes in a file by analyzing indentation patterns
 * This is a simpler alternative to full AST parsing
 */
function estimateFunctionSizes(content) {
  const lines = content.split('\n');
  const functions = [];
  let currentFunction = null;
  let bracketCount = 0;
  let inFunction = false;
  let funcStartLine = 0;
  
  const functionPatterns = [
    /function\s+([a-zA-Z0-9_$]+)\s*\(/,           // function declaration
    /const\s+([a-zA-Z0-9_$]+)\s*=\s*function/,    // function expression
    /const\s+([a-zA-Z0-9_$]+)\s*=\s*\(/,          // arrow function
    /([a-zA-Z0-9_$]+)\s*=\s*\(/,                  // arrow function assignment
    /([a-zA-Z0-9_$]+)\s*\(\)\s*{/,                // method
  ];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines and comments
    if (line === '' || line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) {
      continue;
    }
    
    // Check for function start
    if (!inFunction) {
      for (const pattern of functionPatterns) {
        const match = line.match(pattern);
        if (match) {
          inFunction = true;
          funcStartLine = i + 1;
          currentFunction = match[1];
          break;
        }
      }
    }
    
    // Count brackets to determine function end
    if (inFunction) {
      const openBrackets = (line.match(/{/g) || []).length;
      const closeBrackets = (line.match(/}/g) || []).length;
      bracketCount += openBrackets - closeBrackets;
      
      if (bracketCount === 0) {
        const functionLines = i + 1 - funcStartLine;
        if (functionLines > CONFIG.functionMaxLines) {
          functions.push({
            name: currentFunction || 'Anonymous function',
            lines: functionLines,
            startLine: funcStartLine,
            endLine: i + 1,
          });
        }
        inFunction = false;
        currentFunction = null;
      }
    }
  }
  
  return functions;
}

/**
 * Analyze a file for size violations
 */
function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const totalLines = lines.length;
    const isComponent = isLikelyComponent(filePath, content);
    const relativePath = filePath.replace(CONFIG.rootDir, '').replace(/\\/g, '/');
    
    // Check file size
    if (totalLines > CONFIG.componentMaxLines || (isComponent && totalLines > CONFIG.componentMaxLines)) {
      const largeFunctions = estimateFunctionSizes(content);
      
      results.largeFiles.push({
        path: relativePath,
        lines: totalLines,
        isComponent,
        name: path.basename(filePath),
        largeFunctions: largeFunctions.filter(f => f.lines > CONFIG.functionMaxLines),
      });
    }
    
    filesProcessed++;
    if (filesProcessed % 50 === 0) {
      console.log(`Processed ${filesProcessed} files...`);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

/**
 * Walk the directory recursively
 */
function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (shouldExclude(fullPath)) {
      continue;
    }
    
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.isFile() && hasValidExtension(fullPath)) {
      analyzeFile(fullPath);
    }
  }
}

/**
 * Sort results by line count (descending)
 */
function sortResults() {
  results.largeFiles.sort((a, b) => b.lines - a.lines);
}

/**
 * Generate the report
 */
function generateReport() {
  // Add summary
  results.summary = {
    totalFilesExceedingLimit: results.largeFiles.length,
    componentsExceedingLimit: results.largeFiles.filter(f => f.isComponent).length,
    filesProcessed,
  };
  
  // Count large functions
  let largeFunctionCount = 0;
  results.largeFiles.forEach(file => {
    largeFunctionCount += file.largeFunctions.length;
  });
  results.summary.functionsExceedingLimit = largeFunctionCount;
  
  // Write JSON report
  fs.writeFileSync(CONFIG.outputPath, JSON.stringify(results, null, 2));
  
  // Print summary to console
  console.log('\n-------- Component Size Analysis Report --------');
  console.log(`Total files processed: ${filesProcessed}`);
  console.log(`Files exceeding ${CONFIG.componentMaxLines} lines: ${results.largeFiles.length}`);
  console.log(`Components exceeding ${CONFIG.componentMaxLines} lines: ${results.largeFiles.filter(f => f.isComponent).length}`);
  console.log(`Functions exceeding ${CONFIG.functionMaxLines} lines: ${largeFunctionCount}`);
  console.log(`Report written to: ${CONFIG.outputPath}`);
  
  // Print top 10 largest files
  if (results.largeFiles.length > 0) {
    console.log('\nTop 10 largest files:');
    results.largeFiles.slice(0, 10).forEach((file, i) => {
      console.log(`${i + 1}. ${file.name} (${file.lines} lines) - ${file.path} ${file.isComponent ? '[Component]' : ''}`);
    });
  }
  
  // Print top 10 largest components
  const largeComponents = results.largeFiles.filter(f => f.isComponent);
  if (largeComponents.length > 0) {
    console.log('\nTop 10 largest components:');
    largeComponents.slice(0, 10).forEach((comp, i) => {
      console.log(`${i + 1}. ${comp.name} (${comp.lines} lines) - ${comp.path}`);
    });
  }
}

// Main execution
console.log('Starting component size analysis...');
console.log(`Analyzing files in: ${CONFIG.rootDir}`);
walkDir(CONFIG.rootDir);
sortResults();
generateReport();
