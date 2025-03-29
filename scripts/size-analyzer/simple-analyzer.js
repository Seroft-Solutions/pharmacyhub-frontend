/**
 * Simple Component Size Analyzer
 * This script uses basic Node functionality to analyze file sizes
 */

const fs = require('fs');
const path = require('path');

// Configuration
const COMPONENT_SIZE_LIMIT = 200;
const FUNCTION_SIZE_LIMIT = 30;
const DEFAULT_SRC_DIR = '../../src';

// Results storage
const results = {
  oversizedFiles: [],
  totalFiles: 0,
};

/**
 * Find all JavaScript and TypeScript files in a directory recursively
 */
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && 
        !filePath.includes('node_modules') && 
        !filePath.includes('dist') && 
        !filePath.includes('build')) {
      findFiles(filePath, fileList);
    } else if (
      (file.endsWith('.js') || 
       file.endsWith('.jsx') || 
       file.endsWith('.ts') || 
       file.endsWith('.tsx')) && 
      !file.endsWith('.test.js') && 
      !file.endsWith('.test.tsx') && 
      !file.endsWith('.spec.js') && 
      !file.endsWith('.spec.tsx')
    ) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Analyze a file's line count
 */
function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const lineCount = lines.length;
    
    results.totalFiles++;
    
    // Check if it might be a component file
    const isComponentFile = (
      filePath.includes('/components/') || 
      content.includes('React') || 
      content.includes('Component') ||
      content.includes('function') && content.includes('return') && content.includes('<')
    );
    
    if (isComponentFile && lineCount > COMPONENT_SIZE_LIMIT) {
      results.oversizedFiles.push({
        file: filePath,
        lineCount,
        isComponent: true,
      });
    }
  } catch (error) {
    console.error(`Error analyzing file ${filePath}:`, error.message);
  }
}

/**
 * Generate a simple report of oversized files
 */
function generateReport() {
  // Sort results by line count (descending)
  results.oversizedFiles.sort((a, b) => b.lineCount - a.lineCount);
  
  console.log('\n====== Component Size Analysis Report ======');
  
  console.log(`\nFile Statistics:`);
  console.log(`Total Files: ${results.totalFiles}`);
  console.log(`Oversized Files (>${COMPONENT_SIZE_LIMIT} lines): ${results.oversizedFiles.length}`);
  
  // List oversized files
  console.log(`\nOversized Files (>${COMPONENT_SIZE_LIMIT} lines):`);
  if (results.oversizedFiles.length === 0) {
    console.log('No oversized files found.');
  } else {
    console.log(`${'File'.padEnd(80)} ${'Lines'.padEnd(10)}`);
    console.log('-'.repeat(90));
    
    results.oversizedFiles.forEach(file => {
      const relativePath = path.relative(process.cwd(), file.file);
      console.log(`${relativePath.padEnd(80)} ${file.lineCount.toString().padEnd(10)}`);
    });
  }
  
  // Save report to file
  const reportDir = path.join(process.cwd(), '../../reports');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  const reportData = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: results.totalFiles,
      oversizedFiles: results.oversizedFiles.length,
    },
    oversizedFiles: results.oversizedFiles.map(file => ({
      file: path.relative(path.join(process.cwd(), '../..'), file.file),
      lineCount: file.lineCount,
    })),
  };
  
  const reportFilePath = path.join(reportDir, 'simple-size-analysis.json');
  fs.writeFileSync(reportFilePath, JSON.stringify(reportData, null, 2), 'utf8');
  
  console.log(`\nDetailed report saved to: ${path.relative(process.cwd(), reportFilePath)}`);
}

/**
 * Main function to run the analysis
 */
function main() {
  // Get source directory
  const srcDir = process.argv[2] || DEFAULT_SRC_DIR;
  const fullSrcPath = path.resolve(process.cwd(), srcDir);
  
  console.log(`Analyzing components in: ${fullSrcPath}`);
  
  // Find all files
  const files = findFiles(fullSrcPath);
  
  console.log(`Found ${files.length} files to analyze`);
  
  // Analyze each file
  files.forEach(file => {
    try {
      analyzeFile(file);
    } catch (error) {
      console.error(`Error analyzing file ${file}:`, error.message);
    }
  });
  
  // Generate the report
  generateReport();
}

// Run the analysis
main();
