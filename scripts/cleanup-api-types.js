const fs = require('fs');
const path = require('path');

// Path to the generated types directory
const generatedDir = path.join(__dirname, '../src/features/core/api-schema/generated');

// Remove API client files (we only want the types)
const filesToRemove = [
  'api.ts',
  'base.ts',
  'common.ts',
  'configuration.ts',
];

filesToRemove.forEach(file => {
  const filePath = path.join(generatedDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`Removing ${file}...`);
    fs.unlinkSync(filePath);
  }
});

// Modify index.ts to export only the models
const indexPath = path.join(generatedDir, 'index.ts');
if (fs.existsSync(indexPath)) {
  console.log('Updating index.ts...');
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  // Remove API exports but keep model exports
  const updatedContent = indexContent
    .split('\n')
    .filter(line => !line.includes('api') && !line.includes('Api') && !line.includes('configuration'))
    .join('\n');
  fs.writeFileSync(indexPath, updatedContent);
}

console.log('Cleanup complete!');
