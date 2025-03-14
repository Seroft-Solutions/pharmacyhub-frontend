#!/usr/bin/env node
/**
 * Permission Scanner
 * 
 * This script scans a Next.js/React application to extract all roles and permissions
 * defined throughout the codebase and outputs them in a structured JSON format.
 * 
 * Usage:
 *   node scan-permissions.js [output-file]
 * 
 * Example:
 *   node scan-permissions.js permissions-report.json
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Configuration
const SRC_DIR = path.resolve(__dirname, '../src');
const SCAN_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];
const EXCLUDE_DIRS = ['node_modules', '.next', 'out', 'build', 'dist', '.git'];
const DEFAULT_OUTPUT_FILE = path.resolve(__dirname, '../permissions-report.json');
const MAX_FILE_SIZE = 1024 * 1024; // 1MB max file size to scan

// Patterns to search for
const PATTERNS = {
  // TypeScript/JavaScript enum patterns
  ENUM_PATTERN: /enum\s+(\w+)(?:\s*\{([^}]*)\})/g,
  ENUM_VALUE_PATTERN: /(\w+)(?:\s*=\s*(?:'([^']*)'|"([^"]*)"|\w+))?/g,
  
  // Export const patterns for permissions/roles
  EXPORT_CONST_PATTERN: /export\s+const\s+(\w+(?:Permissions?|Roles?|ACCESS|RBAC))\s*=\s*(?:\{([^}]*)\}|\[([^\]]*)\])/g,
  
  // Permission/Role strings
  PERMISSION_STRING_PATTERN: /(?:['"])([A-Za-z0-9_:.@-]+(?:[:.](?:read|write|create|delete|update|manage|edit|view|list|admin|user))*)(?:['"])/g,
  
  // Interface definitions for permissions/roles
  INTERFACE_PATTERN: /(?:interface|type)\s+(\w+(?:Permission|Role|Auth|Access|User))\s*(?:extends\s+\w+)?\s*\{([^}]+)\}/g,
  
  // Permission Guards
  PERMISSION_GUARD_PATTERN: /<(?:Permission|Role|Any|All)(?:Permission|Role)Guard(?:\s+[^>]*permission(?:s)?\s*=\s*(?:\{(?:[^{}]*)\}|"[^"]*"|'[^']*'))?/g,
  
  // usePermission hook calls
  USE_PERMISSION_HOOK: /use(?:Permission|Role|Auth|Access)\s*\(\s*(?:[\w.[\]'"]+)\s*\)/g,
  
  // hasPermission function calls
  HAS_PERMISSION_CALLS: /(?:hasPermission|hasRole|checkPermission|checkAccess|isAuthorized|can)\(\s*(?:['"]([^'"]+)['"]|[\w.[\]]+)/g,
  
  // Constants or types that might contain roles/permissions
  PERMISSION_CONSTANTS: /(?:const|let|var)\s+(\w+(?:Permission|Role|Auth|Access))s?\s*=\s*/g,
  
  // General permission/role strings that might be defined
  GENERAL_PERMISSION_STRINGS: /['"]([A-Za-z]+:[A-Za-z_]+)['"]|['"]([A-Za-z_]+\.[A-Za-z_]+)['"]|ROLE_([A-Za-z_]+)/g
};

// Main data structure to hold results
const permissionsAndRoles = {
  permissions: {
    // Module based organization
    byModule: {},
    // Flat list of all permissions
    all: new Set()
  },
  roles: {
    defined: new Set(),
    withPermissions: {}
  },
  permissionUsage: {
    // Where permissions are actually used
    inGuards: {},
    inHooks: {},
    inCalls: {}
  },
  files: {
    // Files where permissions are defined
    definitions: [],
    // Files where permissions are used
    usage: []
  },
  metadata: {
    scannedFiles: 0,
    scannedDirs: 0,
    scanTime: 0
  }
};

/**
 * Recursively scans a directory for files to analyze
 */
async function scanDirectory(dir) {
  permissionsAndRoles.metadata.scannedDirs++;
  
  try {
    const entries = await readdir(dir);
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      
      // Skip excluded directories
      if (EXCLUDE_DIRS.includes(entry)) continue;
      
      try {
        const stats = await stat(fullPath);
        
        if (stats.isDirectory()) {
          // Recursively scan subdirectories
          await scanDirectory(fullPath);
        } else if (stats.isFile() && 
                  SCAN_EXTENSIONS.includes(path.extname(fullPath)) && 
                  stats.size <= MAX_FILE_SIZE) {
          // Process file if it has the right extension and isn't too large
          await analyzeFile(fullPath);
        }
      } catch (err) {
        console.error(`Error processing ${fullPath}:`, err.message);
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err.message);
  }
}

/**
 * Extracts potential permission values from JavaScript/TypeScript patterns
 */
function extractPermissionsFromMatch(match, pattern, content) {
  const permissions = [];
  let m;
  
  while ((m = pattern.exec(content)) !== null) {
    if (m[1]) permissions.push(m[1]);
    if (m[2]) permissions.push(m[2]);
    if (m[3]) permissions.push(m[3]);
  }
  
  return permissions.filter(Boolean);
}

/**
 * Analyzes a single file for permission and role definitions/usage
 */
async function analyzeFile(filePath) {
  permissionsAndRoles.metadata.scannedFiles++;
  
  try {
    const content = await readFile(filePath, 'utf8');
    let foundDefinition = false;
    let foundUsage = false;
    
    // Get module name from file path
    const relativePath = filePath.split('src')[1] || filePath;
    const modulePath = relativePath.split(path.sep).filter(Boolean);
    const module = modulePath.length > 1 ? modulePath[0] : 'core';
    
    // Initialize module in results if needed
    if (!permissionsAndRoles.permissions.byModule[module]) {
      permissionsAndRoles.permissions.byModule[module] = new Set();
    }
    
    // 1. Look for enum definitions
    let enumMatch;
    const resetEnumPattern = new RegExp(PATTERNS.ENUM_PATTERN);
    while ((enumMatch = resetEnumPattern.exec(content)) !== null) {
      const enumName = enumMatch[1];
      const enumBody = enumMatch[2];
      
      // Only process if it looks like a permission or role enum
      if (enumName.includes('Permission') || enumName.includes('Role') || enumName.includes('Access')) {
        foundDefinition = true;
        
        // Extract enum values
        const enumValues = enumBody.split(',').map(val => val.trim());
        
        for (const value of enumValues) {
          if (!value) continue;
          
          // Extract enum name and possibly string value
          const parts = value.split('=').map(p => p.trim());
          const name = parts[0];
          
          if (name) {
            // Get string value if available, otherwise use the name
            let permissionValue = name;
            if (parts.length > 1) {
              const quotedValue = parts[1].match(/['"]([^'"]+)['"]/);
              if (quotedValue) {
                permissionValue = quotedValue[1];
              }
            }
            
            if (enumName.includes('Permission') || enumName.includes('Access')) {
              permissionsAndRoles.permissions.all.add(permissionValue);
              permissionsAndRoles.permissions.byModule[module].add(permissionValue);
            } else if (enumName.includes('Role')) {
              permissionsAndRoles.roles.defined.add(permissionValue);
            }
          }
        }
      }
    }
    
    // 2. Look for exported constants (arrays, objects) with permissions/roles
    let exportMatch;
    const resetExportPattern = new RegExp(PATTERNS.EXPORT_CONST_PATTERN);
    while ((exportMatch = resetExportPattern.exec(content)) !== null) {
      const constName = exportMatch[1];
      const constBody = exportMatch[2] || exportMatch[3] || '';
      
      if (constName) {
        // Extract string values from the constant body
        const resetStringPattern = new RegExp(PATTERNS.PERMISSION_STRING_PATTERN.source, 'g');
        let stringMatch;
        while ((stringMatch = resetStringPattern.exec(constBody)) !== null) {
          if (stringMatch[1]) {
            foundDefinition = true;
            
            const permValue = stringMatch[1];
            if (constName.includes('Permission') || constName.includes('Access')) {
              permissionsAndRoles.permissions.all.add(permValue);
              permissionsAndRoles.permissions.byModule[module].add(permValue);
            } else if (constName.includes('Role')) {
              permissionsAndRoles.roles.defined.add(permValue);
            } else {
              // Could be either, add to both for now (can be filtered later)
              if (permValue.includes(':') || permValue.includes('.')) {
                permissionsAndRoles.permissions.all.add(permValue);
                permissionsAndRoles.permissions.byModule[module].add(permValue);
              } else {
                permissionsAndRoles.roles.defined.add(permValue);
              }
            }
          }
        }
      }
    }
    
    // 3. Look for interface/type definitions
    let interfaceMatch;
    const resetInterfacePattern = new RegExp(PATTERNS.INTERFACE_PATTERN);
    while ((interfaceMatch = resetInterfacePattern.exec(content)) !== null) {
      const interfaceName = interfaceMatch[1];
      const interfaceBody = interfaceMatch[2];
      
      if (interfaceName && (
          interfaceName.includes('Permission') || 
          interfaceName.includes('Role') || 
          interfaceName.includes('Auth') || 
          interfaceName.includes('Access')
      )) {
        foundDefinition = true;
        
        // Extract string literals that could be permissions
        const resetStringPattern = new RegExp(PATTERNS.PERMISSION_STRING_PATTERN.source, 'g');
        let stringMatch;
        while ((stringMatch = resetStringPattern.exec(interfaceBody)) !== null) {
          if (stringMatch[1]) {
            const permValue = stringMatch[1];
            if (interfaceName.includes('Permission') || interfaceName.includes('Access')) {
              permissionsAndRoles.permissions.all.add(permValue);
              permissionsAndRoles.permissions.byModule[module].add(permValue);
            } else if (interfaceName.includes('Role')) {
              permissionsAndRoles.roles.defined.add(permValue);
            }
          }
        }
      }
    }
    
    // 4. Look for permission/role guard usages
    let guardMatch;
    const resetGuardPattern = new RegExp(PATTERNS.PERMISSION_GUARD_PATTERN);
    while ((guardMatch = resetGuardPattern.exec(content)) !== null) {
      foundUsage = true;
      
      // The actual permission values will be in nearby code, search for them
      const lineStart = content.lastIndexOf('\n', guardMatch.index);
      const lineEnd = content.indexOf('\n', guardMatch.index);
      const line = content.substring(lineStart, lineEnd);
      
      // Find quoted strings in the line
      const stringMatches = [...line.matchAll(/['"]([^'"]+)['"]/g)];
      for (const stringMatch of stringMatches) {
        if (stringMatch[1]) {
          const permValue = stringMatch[1];
          
          // Record usage
          if (!permissionsAndRoles.permissionUsage.inGuards[permValue]) {
            permissionsAndRoles.permissionUsage.inGuards[permValue] = [];
          }
          permissionsAndRoles.permissionUsage.inGuards[permValue].push(
            relativePath
          );
          
          // Also add to general permissions if it looks like one
          if (permValue.includes(':') || permValue.includes('.')) {
            permissionsAndRoles.permissions.all.add(permValue);
            permissionsAndRoles.permissions.byModule[module].add(permValue);
          } else if (/^[A-Z_]+$/.test(permValue)) {
            permissionsAndRoles.roles.defined.add(permValue);
          }
        }
      }
    }
    
    // 5. Look for usePermission hook usages
    let hookMatch;
    const resetHookPattern = new RegExp(PATTERNS.USE_PERMISSION_HOOK);
    while ((hookMatch = resetHookPattern.exec(content)) !== null) {
      foundUsage = true;
      
      // The actual permission values will be in nearby code, search for them
      const lineStart = content.lastIndexOf('\n', hookMatch.index);
      const lineEnd = content.indexOf('\n', hookMatch.index);
      const line = content.substring(lineStart, lineEnd);
      
      // Find quoted strings in the line
      const stringMatches = [...line.matchAll(/['"]([^'"]+)['"]/g)];
      for (const stringMatch of stringMatches) {
        if (stringMatch[1]) {
          const permValue = stringMatch[1];
          
          // Record usage
          if (!permissionsAndRoles.permissionUsage.inHooks[permValue]) {
            permissionsAndRoles.permissionUsage.inHooks[permValue] = [];
          }
          permissionsAndRoles.permissionUsage.inHooks[permValue].push(
            relativePath
          );
          
          // Also add to general permissions if it looks like one
          if (permValue.includes(':') || permValue.includes('.')) {
            permissionsAndRoles.permissions.all.add(permValue);
            permissionsAndRoles.permissions.byModule[module].add(permValue);
          } else if (/^[A-Z_]+$/.test(permValue)) {
            permissionsAndRoles.roles.defined.add(permValue);
          }
        }
      }
    }
    
    // 6. Look for hasPermission function calls
    let callMatch;
    const resetCallPattern = new RegExp(PATTERNS.HAS_PERMISSION_CALLS);
    while ((callMatch = resetCallPattern.exec(content)) !== null) {
      foundUsage = true;
      
      if (callMatch[1]) {
        const permValue = callMatch[1];
        
        // Record usage
        if (!permissionsAndRoles.permissionUsage.inCalls[permValue]) {
          permissionsAndRoles.permissionUsage.inCalls[permValue] = [];
        }
        permissionsAndRoles.permissionUsage.inCalls[permValue].push(
          relativePath
        );
        
        // Also add to general permissions if it looks like one
        if (permValue.includes(':') || permValue.includes('.')) {
          permissionsAndRoles.permissions.all.add(permValue);
          permissionsAndRoles.permissions.byModule[module].add(permValue);
        } else if (/^[A-Z_]+$/.test(permValue)) {
          permissionsAndRoles.roles.defined.add(permValue);
        }
      }
    }
    
    // 7. Look for general permission/role strings
    let generalMatch;
    const resetGeneralPattern = new RegExp(PATTERNS.GENERAL_PERMISSION_STRINGS);
    while ((generalMatch = resetGeneralPattern.exec(content)) !== null) {
      const permValue = generalMatch[1] || generalMatch[2] || generalMatch[3];
      
      if (permValue) {
        // Determine if it's likely a permission or role
        if (permValue.includes(':') || permValue.includes('.')) {
          permissionsAndRoles.permissions.all.add(permValue);
          permissionsAndRoles.permissions.byModule[module].add(permValue);
        } else if (/^[A-Z_]+$/.test(permValue)) {
          permissionsAndRoles.roles.defined.add(permValue);
        }
      }
    }
    
    // 8. Look for explicit permission constants
    let constantMatch;
    const resetConstantPattern = new RegExp(PATTERNS.PERMISSION_CONSTANTS);
    while ((constantMatch = resetConstantPattern.exec(content)) !== null) {
      foundDefinition = true;
      
      const constantName = constantMatch[1];
      const lineEnd = content.indexOf('\n', constantMatch.index);
      const nextLines = content.substring(constantMatch.index, lineEnd + 500); // Look at next 500 chars
      
      // Find quoted strings in the nearby code
      const stringMatches = [...nextLines.matchAll(/['"]([^'"]+)['"]/g)];
      for (const stringMatch of stringMatches) {
        if (stringMatch[1]) {
          const permValue = stringMatch[1];
          
          if (constantName.includes('Permission') || constantName.includes('Access')) {
            permissionsAndRoles.permissions.all.add(permValue);
            permissionsAndRoles.permissions.byModule[module].add(permValue);
          } else if (constantName.includes('Role')) {
            permissionsAndRoles.roles.defined.add(permValue);
          }
        }
      }
    }
    
    // Record file if it contains definitions or usage
    if (foundDefinition) {
      permissionsAndRoles.files.definitions.push(relativePath);
    }
    
    if (foundUsage) {
      permissionsAndRoles.files.usage.push(relativePath);
    }
  } catch (err) {
    console.error(`Error analyzing file ${filePath}:`, err.message);
  }
}

/**
 * Find roles that have specific permissions mapped to them
 */
async function findRolePermissionMappings() {
  // This would require more sophisticated analysis, for now we'll just look
  // for files that might contain these mappings
  try {
    const roleMappingFiles = await findRoleMappingFiles();
    
    for (const filePath of roleMappingFiles) {
      const content = await readFile(filePath, 'utf8');
      
      // Look for patterns like role: [permissions] or role: {permissions}
      const roleMatches = [...content.matchAll(/['"]([A-Z_]+)['"]:\s*(?:\[([^\]]*)\]|\{([^}]*)\})/g)];
      
      for (const roleMatch of roleMatches) {
        const roleName = roleMatch[1];
        const permissionsText = roleMatch[2] || roleMatch[3] || '';
        
        if (roleName && permissionsText) {
          permissionsAndRoles.roles.defined.add(roleName);
          
          if (!permissionsAndRoles.roles.withPermissions[roleName]) {
            permissionsAndRoles.roles.withPermissions[roleName] = new Set();
          }
          
          // Extract permission values
          const permMatches = [...permissionsText.matchAll(/['"]([^'"]+)['"]/g)];
          for (const permMatch of permMatches) {
            if (permMatch[1]) {
              permissionsAndRoles.roles.withPermissions[roleName].add(permMatch[1]);
              permissionsAndRoles.permissions.all.add(permMatch[1]);
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('Error finding role-permission mappings:', err.message);
  }
}

/**
 * Find files likely to contain role->permission mappings
 */
async function findRoleMappingFiles() {
  const candidateFiles = [];
  
  // Common file patterns for role mappings
  const patterns = [
    'role',
    'permission',
    'auth',
    'rbac',
    'access',
    'security'
  ];
  
  for (const pattern of patterns) {
    try {
      // Use find command to locate potential files
      const files = await new Promise((resolve, reject) => {
        const { exec } = require('child_process');
        exec(`find "${SRC_DIR}" -type f -name "*${pattern}*" ${SCAN_EXTENSIONS.map(ext => `-o -name "*${ext}"`).join(' ')}`,
          (error, stdout, stderr) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(stdout.trim().split('\n').filter(Boolean));
          }
        );
      });
      
      candidateFiles.push(...files);
    } catch (err) {
      // Fallback to manual searching if find command fails
      await findFilesRecursively(SRC_DIR, candidateFiles, pattern);
    }
  }
  
  return [...new Set(candidateFiles)]; // Remove duplicates
}

/**
 * Manually find files matching a pattern if find command fails
 */
async function findFilesRecursively(dir, results, pattern) {
  const entries = await readdir(dir);
  
  for (const entry of entries) {
    if (EXCLUDE_DIRS.includes(entry)) continue;
    
    const fullPath = path.join(dir, entry);
    const stats = await stat(fullPath);
    
    if (stats.isDirectory()) {
      await findFilesRecursively(fullPath, results, pattern);
    } else if (stats.isFile() && 
              (entry.toLowerCase().includes(pattern) || 
               SCAN_EXTENSIONS.some(ext => entry.endsWith(ext)))) {
      results.push(fullPath);
    }
  }
}

/**
 * Prepares the final report data for output
 */
function prepareReportData() {
  // Convert Sets to arrays for JSON serialization
  const report = {
    permissions: {
      byModule: {},
      all: [...permissionsAndRoles.permissions.all]
    },
    roles: {
      defined: [...permissionsAndRoles.roles.defined],
      withPermissions: {}
    },
    permissionUsage: permissionsAndRoles.permissionUsage,
    files: permissionsAndRoles.files,
    metadata: permissionsAndRoles.metadata
  };
  
  // Convert module permissions from Sets to arrays
  for (const [module, permissions] of Object.entries(permissionsAndRoles.permissions.byModule)) {
    report.permissions.byModule[module] = [...permissions];
  }
  
  // Convert role permissions from Sets to arrays
  for (const [role, permissions] of Object.entries(permissionsAndRoles.roles.withPermissions)) {
    report.roles.withPermissions[role] = [...permissions];
  }
  
  return report;
}

/**
 * Main function to run the scanner
 */
async function main() {
  const startTime = Date.now();
  
  // Get output file from command line args if provided
  const outputFile = process.argv[2] || DEFAULT_OUTPUT_FILE;
  
  console.log(`Starting permission scanner on ${SRC_DIR}`);
  console.log('This may take a few minutes for large codebases...');
  
  try {
    // Scan the source directory
    await scanDirectory(SRC_DIR);
    
    // Look for role-permission mappings
    await findRolePermissionMappings();
    
    // Calculate scan time
    permissionsAndRoles.metadata.scanTime = Date.now() - startTime;
    
    // Prepare report data
    const reportData = prepareReportData();
    
    // Write results to file
    await writeFile(
      outputFile,
      JSON.stringify(reportData, null, 2),
      'utf8'
    );
    
    console.log(`\nScan completed in ${reportData.metadata.scanTime / 1000} seconds`);
    console.log(`Scanned ${reportData.metadata.scannedFiles} files in ${reportData.metadata.scannedDirs} directories`);
    console.log(`Found ${reportData.permissions.all.length} unique permissions across ${Object.keys(reportData.permissions.byModule).length} modules`);
    console.log(`Found ${reportData.roles.defined.length} unique roles`);
    console.log(`Report saved to ${outputFile}`);
  } catch (err) {
    console.error('Error running permission scanner:', err);
    process.exit(1);
  }
}

// Run the scanner
main();
