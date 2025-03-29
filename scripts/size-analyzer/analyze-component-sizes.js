/**
 * Component and Function Size Analyzer
 * 
 * This script analyzes React component files and identifies:
 * 1. Components that exceed the 200-line limit
 * 2. Functions that exceed the 30-line limit
 * 
 * Usage: node analyze-component-sizes.js [directory]
 * Default directory is './src' if not specified
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

// Configuration
const COMPONENT_SIZE_LIMIT = 200;
const FUNCTION_SIZE_LIMIT = 30;
const DEFAULT_SRC_DIR = './src';

// Colors for console output
const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Results storage
const results = {
  oversizedComponents: [],
  oversizedFunctions: [],
  totalComponents: 0,
  totalFunctions: 0,
};

/**
 * Get the line count of a file
 */
function getLineCount(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return content.split('\n').length;
}

/**
 * Parse a file and extract component and function information
 */
function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  // Skip files that are not likely React components
  if (!content.includes('React') && 
      !content.includes('function') && 
      !content.includes('class') && 
      !content.includes('=>')) {
    return;
  }
  
  try {
    const ast = parser.parse(content, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript', 'classProperties', 'decorators-legacy'],
    });
    
    // Track components and functions in this file
    const fileComponents = [];
    const fileFunctions = [];
    
    traverse(ast, {
      // Function components
      FunctionDeclaration(path) {
        const node = path.node;
        if (node.id && node.id.name) {
          const name = node.id.name;
          const startLine = node.loc.start.line;
          const endLine = node.loc.end.line;
          const lineCount = endLine - startLine + 1;
          
          // Check if it might be a React component (name starts with uppercase)
          const isComponent = name.charAt(0) === name.charAt(0).toUpperCase();
          
          if (isComponent) {
            results.totalComponents++;
            fileComponents.push({ name, lineCount, startLine, endLine });
            
            if (lineCount > COMPONENT_SIZE_LIMIT) {
              results.oversizedComponents.push({
                file: filePath,
                name,
                lineCount,
                startLine,
                endLine
              });
            }
          } else {
            results.totalFunctions++;
            fileFunctions.push({ name, lineCount, startLine, endLine });
            
            if (lineCount > FUNCTION_SIZE_LIMIT) {
              results.oversizedFunctions.push({
                file: filePath,
                name,
                lineCount,
                startLine,
                endLine
              });
            }
          }
        }
      },
      
      // Arrow function components
      VariableDeclarator(path) {
        if (path.node.id && path.node.id.name && path.node.init) {
          const name = path.node.id.name;
          
          // Check if it's an arrow function
          if (path.node.init.type === 'ArrowFunctionExpression') {
            const startLine = path.node.loc.start.line;
            const endLine = path.node.loc.end.line;
            const lineCount = endLine - startLine + 1;
            
            // Check if it might be a React component (name starts with uppercase)
            const isComponent = name.charAt(0) === name.charAt(0).toUpperCase();
            
            if (isComponent) {
              results.totalComponents++;
              fileComponents.push({ name, lineCount, startLine, endLine });
              
              if (lineCount > COMPONENT_SIZE_LIMIT) {
                results.oversizedComponents.push({
                  file: filePath,
                  name,
                  lineCount,
                  startLine,
                  endLine
                });
              }
            } else {
              results.totalFunctions++;
              fileFunctions.push({ name, lineCount, startLine, endLine });
              
              if (lineCount > FUNCTION_SIZE_LIMIT) {
                results.oversizedFunctions.push({
                  file: filePath,
                  name,
                  lineCount,
                  startLine,
                  endLine
                });
              }
            }
          }
        }
      },
      
      // Methods in class components
      ClassDeclaration(path) {
        const node = path.node;
        if (node.id && node.id.name) {
          const className = node.id.name;
          const startLine = node.loc.start.line;
          const endLine = node.loc.end.line;
          const lineCount = endLine - startLine + 1;
          
          // Check if it extends React.Component or Component
          const isReactComponent = node.superClass && 
            ((node.superClass.type === 'MemberExpression' && 
              node.superClass.object.name === 'React' && 
              node.superClass.property.name === 'Component') ||
             (node.superClass.type === 'Identifier' && 
              node.superClass.name === 'Component'));
          
          if (isReactComponent || className.includes('Component')) {
            results.totalComponents++;
            fileComponents.push({ name: className, lineCount, startLine, endLine });
            
            if (lineCount > COMPONENT_SIZE_LIMIT) {
              results.oversizedComponents.push({
                file: filePath,
                name: className,
                lineCount,
                startLine,
                endLine
              });
            }
          }
          
          // Analyze methods inside the class
          node.body.body.forEach(classMethod => {
            if (classMethod.type === 'ClassMethod' && classMethod.key) {
              const methodName = classMethod.key.name;
              if (methodName && methodName !== 'constructor' && methodName !== 'render') {
                const methodStartLine = classMethod.loc.start.line;
                const methodEndLine = classMethod.loc.end.line;
                const methodLineCount = methodEndLine - methodStartLine + 1;
                
                results.totalFunctions++;
                fileFunctions.push({ 
                  name: `${className}.${methodName}`, 
                  lineCount: methodLineCount, 
                  startLine: methodStartLine, 
                  endLine: methodEndLine 
                });
                
                if (methodLineCount > FUNCTION_SIZE_LIMIT) {
                  results.oversizedFunctions.push({
                    file: filePath,
                    name: `${className}.${methodName}`,
                    lineCount: methodLineCount,
                    startLine: methodStartLine,
                    endLine: methodEndLine
                  });
                }
              }
            }
          });
        }
      },
      
      // Functions inside components (hooks, handlers, etc.)
      FunctionExpression(path) {
        const parent = path.parent;
        
        // Check if it's assigned to a variable
        if (parent.type === 'VariableDeclarator' && parent.id && parent.id.name) {
          const name = parent.id.name;
          const startLine = path.node.loc.start.line;
          const endLine = path.node.loc.end.line;
          const lineCount = endLine - startLine + 1;
          
          results.totalFunctions++;
          fileFunctions.push({ name, lineCount, startLine, endLine });
          
          if (lineCount > FUNCTION_SIZE_LIMIT) {
            results.oversizedFunctions.push({
              file: filePath,
              name,
              lineCount,
              startLine,
              endLine
            });
          }
        }
        // Check if it's a property of an object
        else if (parent.type === 'Property' && parent.key && parent.key.name) {
          const name = parent.key.name;
          const startLine = path.node.loc.start.line;
          const endLine = path.node.loc.end.line;
          const lineCount = endLine - startLine + 1;
          
          results.totalFunctions++;
          fileFunctions.push({ name, lineCount, startLine, endLine });
          
          if (lineCount > FUNCTION_SIZE_LIMIT) {
            results.oversizedFunctions.push({
              file: filePath,
              name,
              lineCount,
              startLine,
              endLine
            });
          }
        }
      },
    });
    
  } catch (error) {
    console.error(`${COLORS.red}Error parsing ${filePath}:${COLORS.reset}`, error.message);
  }
}

/**
 * Generate a report of the analysis results
 */
function generateReport() {
  // Sort results by line count (descending)
  results.oversizedComponents.sort((a, b) => b.lineCount - a.lineCount);
  results.oversizedFunctions.sort((a, b) => b.lineCount - a.lineCount);
  
  console.log('\n');
  console.log(`${COLORS.magenta}====== Component and Function Size Analysis Report ======${COLORS.reset}`);
  
  // Component statistics
  console.log(`\n${COLORS.cyan}Component Statistics:${COLORS.reset}`);
  console.log(`Total Components: ${results.totalComponents}`);
  console.log(`Oversized Components (>${COMPONENT_SIZE_LIMIT} lines): ${results.oversizedComponents.length}`);
  console.log(`Percentage of Oversized Components: ${(results.oversizedComponents.length / results.totalComponents * 100).toFixed(2)}%`);
  
  // Function statistics
  console.log(`\n${COLORS.cyan}Function Statistics:${COLORS.reset}`);
  console.log(`Total Functions: ${results.totalFunctions}`);
  console.log(`Oversized Functions (>${FUNCTION_SIZE_LIMIT} lines): ${results.oversizedFunctions.length}`);
  console.log(`Percentage of Oversized Functions: ${(results.oversizedFunctions.length / results.totalFunctions * 100).toFixed(2)}%`);
  
  // List oversized components
  console.log(`\n${COLORS.yellow}Oversized Components (>${COMPONENT_SIZE_LIMIT} lines):${COLORS.reset}`);
  if (results.oversizedComponents.length === 0) {
    console.log('No oversized components found.');
  } else {
    console.log(`${'Component'.padEnd(40)} ${'File'.padEnd(50)} ${'Lines'.padEnd(10)}`);
    console.log('-'.repeat(100));
    
    results.oversizedComponents.forEach(component => {
      const formattedFile = path.relative(process.cwd(), component.file);
      console.log(`${component.name.padEnd(40)} ${formattedFile.padEnd(50)} ${component.lineCount.toString().padEnd(10)}`);
    });
  }
  
  // List oversized functions
  console.log(`\n${COLORS.yellow}Oversized Functions (>${FUNCTION_SIZE_LIMIT} lines):${COLORS.reset}`);
  if (results.oversizedFunctions.length === 0) {
    console.log('No oversized functions found.');
  } else {
    console.log(`${'Function'.padEnd(40)} ${'File'.padEnd(50)} ${'Lines'.padEnd(10)}`);
    console.log('-'.repeat(100));
    
    results.oversizedFunctions.forEach(func => {
      const formattedFile = path.relative(process.cwd(), func.file);
      console.log(`${func.name.padEnd(40)} ${formattedFile.padEnd(50)} ${func.lineCount.toString().padEnd(10)}`);
    });
  }
  
  // Generate detailed report file
  const reportData = {
    timestamp: new Date().toISOString(),
    summary: {
      totalComponents: results.totalComponents,
      oversizedComponents: results.oversizedComponents.length,
      oversizedComponentsPercentage: (results.oversizedComponents.length / results.totalComponents * 100).toFixed(2),
      totalFunctions: results.totalFunctions,
      oversizedFunctions: results.oversizedFunctions.length,
      oversizedFunctionsPercentage: (results.oversizedFunctions.length / results.totalFunctions * 100).toFixed(2),
    },
    oversizedComponents: results.oversizedComponents.map(comp => ({
      name: comp.name,
      file: path.relative(process.cwd(), comp.file),
      lineCount: comp.lineCount,
      startLine: comp.startLine,
      endLine: comp.endLine,
    })),
    oversizedFunctions: results.oversizedFunctions.map(func => ({
      name: func.name,
      file: path.relative(process.cwd(), func.file),
      lineCount: func.lineCount,
      startLine: func.startLine,
      endLine: func.endLine,
    })),
  };
  
  const reportDir = path.join(process.cwd(), 'reports');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  const reportFilePath = path.join(reportDir, 'component-size-analysis.json');
  fs.writeFileSync(reportFilePath, JSON.stringify(reportData, null, 2), 'utf8');
  
  console.log(`\n${COLORS.green}Detailed report saved to: ${reportFilePath}${COLORS.reset}`);
  
  // Generate refactoring priority list
  const priorityComponents = [...results.oversizedComponents]
    .sort((a, b) => b.lineCount - a.lineCount)
    .slice(0, 10)
    .map(comp => ({
      name: comp.name,
      file: path.relative(process.cwd(), comp.file),
      lineCount: comp.lineCount,
      priority: 'High',
      recommendation: `Break down into smaller components using functional decomposition or container/presentation pattern`,
    }));
  
  const priorityFunctions = [...results.oversizedFunctions]
    .sort((a, b) => b.lineCount - a.lineCount)
    .slice(0, 10)
    .map(func => ({
      name: func.name,
      file: path.relative(process.cwd(), func.file),
      lineCount: func.lineCount,
      priority: 'Medium',
      recommendation: `Extract smaller functions or use custom hooks`,
    }));
  
  const priorityReport = {
    components: priorityComponents,
    functions: priorityFunctions,
  };
  
  const priorityFilePath = path.join(reportDir, 'refactoring-priorities.json');
  fs.writeFileSync(priorityFilePath, JSON.stringify(priorityReport, null, 2), 'utf8');
  
  console.log(`${COLORS.green}Refactoring priorities saved to: ${priorityFilePath}${COLORS.reset}\n`);
}

/**
 * Main function to run the analysis
 */
function main() {
  // Get source directory from command line args or use default
  const srcDir = process.argv[2] || DEFAULT_SRC_DIR;
  const fullSrcPath = path.resolve(process.cwd(), srcDir);
  
  console.log(`${COLORS.blue}Analyzing components in: ${fullSrcPath}${COLORS.reset}`);
  
  // Find all JavaScript and TypeScript files
  const files = glob.sync(`${srcDir}/**/*.{js,jsx,ts,tsx}`, {
    ignore: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/*.test.*', '**/*.spec.*'],
  });
  
  console.log(`Found ${files.length} files to analyze`);
  
  // Analyze each file
  files.forEach(file => {
    try {
      analyzeFile(path.resolve(process.cwd(), file));
    } catch (error) {
      console.error(`${COLORS.red}Error analyzing file ${file}:${COLORS.reset}`, error.message);
    }
  });
  
  // Generate the report
  generateReport();
}

// Run the analysis
main();
