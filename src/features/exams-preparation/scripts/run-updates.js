/**
 * Run Import Update Scripts
 * 
 * This script runs both import update scripts in sequence
 * to update internal and identify external imports.
 * 
 * Usage:
 * node run-updates.js
 */

const { spawn } = require('child_process');
const path = require('path');

// Function to run a script
function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${path.basename(scriptPath)}`);
    
    const process = spawn('node', [scriptPath], {
      stdio: 'inherit',
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        console.log(`Successfully completed: ${path.basename(scriptPath)}`);
        resolve();
      } else {
        console.error(`Error running: ${path.basename(scriptPath)}`);
        reject(new Error(`Script exited with code ${code}`));
      }
    });
    
    process.on('error', (error) => {
      console.error(`Failed to start script: ${error.message}`);
      reject(error);
    });
  });
}

// Main function
async function main() {
  try {
    // Run the internal imports update script
    await runScript(path.join(__dirname, 'update-imports.js'));
    
    // Run the external imports report script
    await runScript(path.join(__dirname, 'update-external-imports.js'));
    
    console.log('\nCompleted all import updates!');
  } catch (error) {
    console.error('\nError running update scripts:', error);
    process.exit(1);
  }
}

// Run the script
main();
