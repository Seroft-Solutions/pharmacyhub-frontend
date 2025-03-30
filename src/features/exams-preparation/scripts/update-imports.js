/**
 * Import Path Update Script
 * 
 * This script scans the exams-preparation feature files and updates
 * absolute imports to relative imports for better maintainability.
 * 
 * Usage:
 * node update-imports.js
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readDir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);

// Base path for the feature
const FEATURE_PATH = path.resolve(__dirname, '..');
const FEATURE_NAME = 'exams-preparation';

// Extensions to process
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

// Function to calculate the relative path between two files
function calculateRelativePath(fromFile, toModule) {
  const fromDir = path.dirname(fromFile);
  
  // Calculate the relative path
  let relativePath = path.relative(fromDir, toModule);
  
  // Convert Windows backslashes to forward slashes for imports
  relativePath = relativePath.replace(/\\/g, '/');
  
  // Ensure the path starts with ./ or ../
  if (!relativePath.startsWith('.')) {
    relativePath = './' + relativePath;
  }
  
  return relativePath;
}

// Parse a file and update its imports
async function updateFileImports(filePath) {
  try {
    // Read the file content
    const content = await readFile(filePath, 'utf8');
    
    // Replace absolute imports to the feature with relative imports
    const absoluteImportRegex = new RegExp(`@\\/features\\/${FEATURE_NAME}\\/([^'"]*)`, 'g');
    
    let updatedContent = content;
    let match;
    const replacements = [];
    
    // Find all imports to replace
    while ((match = absoluteImportRegex.exec(content)) !== null) {
      const fullImportPath = match[0];
      const importPath = match[1];
      
      // Calculate the target module path
      const targetModule = path.join(FEATURE_PATH, importPath);
      
      // Calculate the relative path
      const relativePath = calculateRelativePath(filePath, targetModule);
      
      // Add to replacements list
      replacements.push({
        original: fullImportPath,
        replacement: relativePath,
      });
    }
    
    // Apply all replacements
    replacements.forEach(({ original, replacement }) => {
      updatedContent = updatedContent.replace(
        new RegExp(original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), 
        replacement
      );
    });
    
    // If content changed, write the updated file
    if (content !== updatedContent) {
      await writeFile(filePath, updatedContent, 'utf8');
      console.log(`Updated imports in: ${path.relative(FEATURE_PATH, filePath)}`);
      return replacements.length;
    }
    
    return 0;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return 0;
  }
}

// Recursively scan directories and process files
async function processDirectory(directoryPath) {
  try {
    const entries = await readDir(directoryPath);
    let updatedFiles = 0;
    
    for (const entry of entries) {
      const entryPath = path.join(directoryPath, entry);
      const entryStat = await stat(entryPath);
      
      // Skip the scripts directory to avoid modifying this script
      if (entryPath.includes('scripts')) {
        continue;
      }
      
      if (entryStat.isDirectory()) {
        // Recursively process subdirectories
        updatedFiles += await processDirectory(entryPath);
      } else if (
        entryStat.isFile() && 
        EXTENSIONS.includes(path.extname(entryPath).toLowerCase())
      ) {
        // Process file if it has a matching extension
        updatedFiles += await updateFileImports(entryPath);
      }
    }
    
    return updatedFiles;
  } catch (error) {
    console.error(`Error processing directory ${directoryPath}:`, error);
    return 0;
  }
}

// Main function
async function main() {
  console.log(`Starting import path updates in ${FEATURE_PATH}`);
  
  try {
    const updatedFiles = await processDirectory(FEATURE_PATH);
    console.log(`Completed import path updates. Updated ${updatedFiles} files.`);
  } catch (error) {
    console.error('Error during import path updates:', error);
  }
}

// Run the script
main();
