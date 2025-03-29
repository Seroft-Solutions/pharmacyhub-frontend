#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('path');

// Path to the analysis results
const REPORT_PATH = path.resolve(__dirname, '../reports/component-size-analysis.json');
const HTML_REPORT_PATH = path.resolve(__dirname, '../reports/component-size-report.html');

async function main() {
  try {
    // Read the analysis results
    const reportData = JSON.parse(await fs.readFile(REPORT_PATH, 'utf8'));
    
    const { oversizedComponents, oversizedFunctions, componentSizeLimit, functionSizeLimit } = reportData;
    
    // Group components by feature module
    const componentsByModule = {};
    
    oversizedComponents.forEach(component => {
      const pathParts = component.path.split(path.sep);
      let module = 'other';
      
      if (pathParts[0] === 'features' && pathParts.length > 1) {
        module = pathParts[1];
      } else if (pathParts[0] === 'app') {
        module = 'app-pages';
      } else if (pathParts[0] === 'components') {
        module = 'shared-components';
      } else if (pathParts[0] === 'core') {
        module = 'core';
      }
      
      if (!componentsByModule[module]) {
        componentsByModule[module] = [];
      }
      
      componentsByModule[module].push(component);
    });
    
    // Group functions by feature module
    const functionsByModule = {};
    
    oversizedFunctions.forEach(func => {
      const pathParts = func.path.split(path.sep);
      let module = 'other';
      
      if (pathParts[0] === 'features' && pathParts.length > 1) {
        module = pathParts[1];
      } else if (pathParts[0] === 'app') {
        module = 'app-pages';
      } else if (pathParts[0] === 'components') {
        module = 'shared-components';
      } else if (pathParts[0] === 'core') {
        module = 'core';
      }
      
      if (!functionsByModule[module]) {
        functionsByModule[module] = [];
      }
      
      functionsByModule[module].push(func);
    });
    
    // Get sorted modules by number of oversized components
    const sortedModules = Object.keys(componentsByModule).sort((a, b) => {
      return componentsByModule[b].length - componentsByModule[a].length;
    });
    
    // Generate HTML report
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Component Size Analysis Report</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        h1, h2, h3 {
          color: #0066cc;
        }
        .summary {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
        }
        .summary-card {
          flex: 1;
          background-color: #f5f5f5;
          border-radius: 5px;
          padding: 20px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px 12px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .module-section {
          margin-bottom: 30px;
          border: 1px solid #eee;
          border-radius: 5px;
          padding: 15px;
        }
        .chart-container {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
        }
        .chart {
          flex: 1;
          height: 300px;
          background-color: #f9f9f9;
          border-radius: 5px;
          padding: 20px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .badge {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 3px;
          font-size: 0.8em;
          font-weight: bold;
          color: white;
        }
        .badge-high {
          background-color: #dc3545;
        }
        .badge-medium {
          background-color: #fd7e14;
        }
        .badge-low {
          background-color: #28a745;
        }
      </style>
    </head>
    <body>
      <h1>Component Size Analysis Report</h1>
      <p>Report generated at: ${new Date().toLocaleString()}</p>
      
      <div class="summary">
        <div class="summary-card">
          <h3>Components</h3>
          <p>Total oversized components: <strong>${oversizedComponents.length}</strong></p>
          <p>Component size limit: <strong>${componentSizeLimit} lines</strong></p>
          <p>Max component size: <strong>${oversizedComponents.length > 0 ? oversizedComponents[0].lineCount : 0} lines</strong></p>
        </div>
        <div class="summary-card">
          <h3>Functions</h3>
          <p>Total oversized functions: <strong>${oversizedFunctions.length}</strong></p>
          <p>Function size limit: <strong>${functionSizeLimit} lines</strong></p>
          <p>Max function size: <strong>${oversizedFunctions.length > 0 ? oversizedFunctions[0].lineCount : 0} lines</strong></p>
        </div>
      </div>
      
      <h2>Overview by Module</h2>
      <table>
        <thead>
          <tr>
            <th>Module</th>
            <th>Oversized Components</th>
            <th>Oversized Functions</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          ${sortedModules.map(module => {
            const componentCount = componentsByModule[module].length;
            const functionCount = functionsByModule[module] ? functionsByModule[module].length : 0;
            
            let priority = 'badge-low';
            if (componentCount > 10 || functionCount > 20) {
              priority = 'badge-high';
            } else if (componentCount > 5 || functionCount > 10) {
              priority = 'badge-medium';
            }
            
            return `
            <tr>
              <td>${module}</td>
              <td>${componentCount}</td>
              <td>${functionCount}</td>
              <td><span class="badge ${priority}">${priority === 'badge-high' ? 'High' : priority === 'badge-medium' ? 'Medium' : 'Low'}</span></td>
            </tr>
            `;
          }).join('')}
        </tbody>
      </table>
      
      <h2>Detailed Analysis by Module</h2>
      
      ${sortedModules.map(module => {
        const components = componentsByModule[module];
        const functions = functionsByModule[module] || [];
        
        return `
        <div class="module-section">
          <h3>${module} Module</h3>
          
          <h4>Oversized Components (${components.length})</h4>
          ${components.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th>File Path</th>
                <th>Line Count</th>
                <th>Exceeds By</th>
              </tr>
            </thead>
            <tbody>
              ${components.map(comp => `
              <tr>
                <td>${comp.path}</td>
                <td>${comp.lineCount}</td>
                <td>${comp.exceededBy}</td>
              </tr>
              `).join('')}
            </tbody>
          </table>
          ` : '<p>No oversized components</p>'}
          
          <h4>Oversized Functions (${functions.length})</h4>
          ${functions.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th>File Path</th>
                <th>Function Name</th>
                <th>Line Count</th>
                <th>Exceeds By</th>
              </tr>
            </thead>
            <tbody>
              ${functions.map(func => `
              <tr>
                <td>${func.path}</td>
                <td>${func.functionName}</td>
                <td>${func.lineCount}</td>
                <td>${func.exceededBy}</td>
              </tr>
              `).join('')}
            </tbody>
          </table>
          ` : '<p>No oversized functions</p>'}
        </div>
        `;
      }).join('')}
      
      <h2>Recommendation</h2>
      <p>Based on the analysis, the following modules should be prioritized for refactoring:</p>
      <ol>
        ${sortedModules.filter(module => {
          const componentCount = componentsByModule[module].length;
          const functionCount = functionsByModule[module] ? functionsByModule[module].length : 0;
          return componentCount > 5 || functionCount > 10;
        }).map(module => `
        <li>
          <strong>${module}</strong> (${componentsByModule[module].length} oversized components, 
          ${functionsByModule[module] ? functionsByModule[module].length : 0} oversized functions)
        </li>
        `).join('')}
      </ol>
      
      <h2>Refactoring Strategies</h2>
      <ul>
        <li><strong>Component Decomposition</strong>: Break large components into smaller, more focused ones</li>
        <li><strong>Custom Hooks</strong>: Extract complex logic into custom hooks</li>
        <li><strong>Container/Presentation Pattern</strong>: Separate data fetching and state management from presentation</li>
        <li><strong>Function Extraction</strong>: Split large functions into smaller, more focused functions</li>
        <li><strong>Atomic Design</strong>: Organize components following atomic design principles</li>
      </ul>
    </body>
    </html>
    `;
    
    // Write HTML report
    await fs.writeFile(HTML_REPORT_PATH, html);
    
    console.log(`HTML report generated at ${HTML_REPORT_PATH}`);
  } catch (error) {
    console.error('Error generating report:', error);
    process.exit(1);
  }
}

main();
