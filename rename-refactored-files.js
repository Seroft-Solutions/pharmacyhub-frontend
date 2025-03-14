/**
 * Script to rename .refactored.tsx files to replace the originals
 *
 * This script:
 * 1. Finds all .refactored.tsx files in the project
 * 2. Backs up the original files to .tsx.bak
 * 3. Renames the .refactored.tsx files to .tsx
 *
 * Usage: node rename-refactored-files.js [--dry-run] [--path=src/features]
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const rename = promisify(fs.rename);

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const pathArg = args.find(arg => arg.startsWith('--path='));
const basePath = pathArg
    ? path.resolve(pathArg.split('=')[1])
    : path.resolve('D:/code/PharmacyHub/pharmacyhub-frontend/src/features');

console.log(`${dryRun ? '[DRY RUN] ' : ''}Starting renaming process...`);
console.log(`Base path: ${basePath}`);

// Find all .refactored.tsx files recursively
async function findRefactoredFiles(dir) {
  const files = [];

  // Read directory contents
  const entries = await readdir(dir, { withFileTypes: true });

  // Process each entry
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // If directory, recursively search inside it
      const subDirFiles = await findRefactoredFiles(fullPath);
      files.push(...subDirFiles);
    } else if (entry.isFile() && entry.name.endsWith('.refactored.tsx')) {
      // If refactored file, add to our list
      files.push(fullPath);
    }
  }

  return files;
}

// Process the files
async function processFiles() {
  try {
    // Find all refactored files
    const refactoredFiles = await findRefactoredFiles(basePath);

    if (refactoredFiles.length === 0) {
      console.log('No .refactored.tsx files found.');
      return;
    }

    console.log(`Found ${refactoredFiles.length} .refactored.tsx files to process.`);

    // Process each file
    for (const refactoredFile of refactoredFiles) {
      const originalFile = refactoredFile.replace('.refactored.tsx', '.tsx');
      const backupFile = originalFile + '.bak';

      console.log(`Processing: ${path.basename(refactoredFile)}`);

      // Check if original file exists
      let originalExists = false;
      try {
        await stat(originalFile);
        originalExists = true;
      } catch (err) {
        console.log(`Original file does not exist: ${originalFile}`);
      }

      if (!dryRun) {
        if (originalExists) {
          // Backup original file
          console.log(`  Backing up ${path.basename(originalFile)} -> ${path.basename(backupFile)}`);
          await rename(originalFile, backupFile);
        }

        // Rename refactored file
        console.log(`  Renaming ${path.basename(refactoredFile)} -> ${path.basename(originalFile)}`);
        await rename(refactoredFile, originalFile);
      } else {
        if (originalExists) {
          console.log(`  Would backup ${path.basename(originalFile)} -> ${path.basename(backupFile)}`);
        }
        console.log(`  Would rename ${path.basename(refactoredFile)} -> ${path.basename(originalFile)}`);
      }
    }

    console.log(`${dryRun ? '[DRY RUN] ' : ''}Processed ${refactoredFiles.length} files successfully.`);

  } catch (err) {
    console.error('Error processing files:', err);
  }
}

// Run the script
processFiles();