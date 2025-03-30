/**
 * External Import Path Update Script
 * 
 * This script scans the project files outside the exams-preparation feature
 * and identifies files that import from the old exams feature. It generates
 * a report of files that need to be updated.
 * 
 * Usage:
 * node update-external-imports.js
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readDir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);

// Base path for the project
const PROJECT_PATH = path.resolve(__dirname, '../../../..');
const OLD_FEATURE_PATH = path.join(PROJECT_PATH, 'src/features/exams');
const NEW_FEATURE_PATH = path.join(PROJECT_PATH, 'src/features/exams-preparation');

// Paths to exclude
const EXCLUDE_PATHS = [
  OLD_FEATURE_PATH,
  NEW_FEATURE_PATH,
  path.join(PROJECT_PATH, 'node_modules'),
  path.join(PROJECT_PATH, '.next'),
  path.join(PROJECT_PATH, '.git'),
];

// Extensions to process
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

// Find files that import from the old exams feature
async function findExternalImports(filePath) {
  try {
    // Read the file content
    const content = await readFile(filePath, 'utf8');
    
    // Check if the file imports from the old exams feature
    const oldExamsImportRegex = /@\/features\/exams\//g;
    const hasOldExamsImport = oldExamsImportRegex.test(content);
    
    if (hasOldExamsImport) {
      // Extract the specific imports
      const importMatches = content.match(/@\/features\/exams\/[^'"]+/g) || [];
      
      return {
        filePath: path.relative(PROJECT_PATH, filePath),
        imports: importMatches,
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return null;
  }
}

// Recursively scan directories and process files
async function processDirectory(directoryPath) {
  try {
    // Check if this directory should be excluded
    if (EXCLUDE_PATHS.some(exclude => directoryPath.startsWith(exclude))) {
      return [];
    }
    
    const entries = await readDir(directoryPath);
    let results = [];
    
    for (const entry of entries) {
      const entryPath = path.join(directoryPath, entry);
      
      try {
        const entryStat = await stat(entryPath);
        
        if (entryStat.isDirectory()) {
          // Recursively process subdirectories
          const subResults = await processDirectory(entryPath);
          results = results.concat(subResults);
        } else if (
          entryStat.isFile() && 
          EXTENSIONS.includes(path.extname(entryPath).toLowerCase())
        ) {
          // Process file if it has a matching extension
          const fileResult = await findExternalImports(entryPath);
          if (fileResult) {
            results.push(fileResult);
          }
        }
      } catch (error) {
        console.error(`Error processing ${entryPath}:`, error);
      }
    }
    
    return results;
  } catch (error) {
    console.error(`Error processing directory ${directoryPath}:`, error);
    return [];
  }
}

// Generate a report of files that need to be updated
async function generateReport(results) {
  if (results.length === 0) {
    console.log('No files found that import from the old exams feature.');
    return;
  }
  
  console.log(`Found ${results.length} files that import from the old exams feature:`);
  
  // Create a markdown report
  let markdownReport = '# External Import Update Report\n\n';
  markdownReport += 'This report identifies files that import from the old `exams` feature and need to be updated to import from the new `exams-preparation` feature.\n\n';
  
  // Group by directory
  const groupedByDirectory = {};
  
  results.forEach(result => {
    const directory = path.dirname(result.filePath);
    if (!groupedByDirectory[directory]) {
      groupedByDirectory[directory] = [];
    }
    groupedByDirectory[directory].push(result);
  });
  
  // Add details for each directory
  Object.keys(groupedByDirectory).sort().forEach(directory => {
    const dirResults = groupedByDirectory[directory];
    
    markdownReport += `## ${directory}\n\n`;
    
    dirResults.forEach(result => {
      markdownReport += `### ${path.basename(result.filePath)}\n\n`;
      markdownReport += '```typescript\n';
      
      // Show the old imports and suggested new imports
      result.imports.forEach(oldImport => {
        const newImport = oldImport.replace('@/features/exams/', '@/features/exams-preparation/');
        markdownReport += `// Old: import { ... } from '${oldImport}';\n`;
        markdownReport += `// New: import { ... } from '${newImport}';\n\n`;
      });
      
      markdownReport += '```\n\n';
    });
  });
  
  // Add a summary
  markdownReport += '## Summary\n\n';
  markdownReport += `Total files to update: ${results.length}\n\n`;
  markdownReport += 'These files should be updated to reference the new exams-preparation feature instead of the old exams feature.\n';
  
  // Write the report
  const reportPath = path.join(NEW_FEATURE_PATH, 'import-update-report.md');
  await writeFile(reportPath, markdownReport, 'utf8');
  
  console.log(`Report generated at: ${reportPath}`);
}

// Main function
async function main() {
  console.log(`Scanning project for imports from the old exams feature...`);
  
  try {
    const results = await processDirectory(PROJECT_PATH);
    await generateReport(results);
  } catch (error) {
    console.error('Error during import scan:', error);
  }
}

// Run the script
main();
