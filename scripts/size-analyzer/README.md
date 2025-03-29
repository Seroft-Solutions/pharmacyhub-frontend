# Component and Function Size Analyzer

This tool analyzes React components and functions in the codebase to identify those that exceed the size limits defined in our architecture principles:

- Components: Maximum 200 lines
- Functions: Maximum 30 lines

## Purpose

As part of our architecture principles (PHAR-291), we need to enforce component size limitations to improve maintainability and encourage separation of concerns. This tool helps identify components and functions that need refactoring.

## Installation

The tool requires Node.js and npm. Navigate to this directory and run:

```bash
npm install
```

This will install the required dependencies:
- @babel/parser
- @babel/traverse
- glob

## Usage

### Running the Analysis

To run the analysis on the src directory, use:

```bash
# On Unix/macOS/Linux
./run-analysis.sh

# On Windows
run-analysis.bat
```

Or run it directly with Node:

```bash
node analyze-component-sizes.js ../../src
```

### Output

The script will:

1. Analyze all JavaScript and TypeScript files in the specified directory
2. Count the total number of components and functions
3. Identify components exceeding 200 lines and functions exceeding 30 lines
4. Generate a console report with statistics and lists of oversized components/functions
5. Save detailed reports to the `reports` directory:
   - `component-size-analysis.json` - Full analysis data
   - `refactoring-priorities.json` - Prioritized list for refactoring

## Interpreting Results

The analysis results help prioritize refactoring efforts:

1. Start with the largest components (highest line count)
2. Apply appropriate decomposition strategies:
   - Functional decomposition
   - UI pattern extraction
   - Container/presentation separation
   - Custom hook extraction

## Next Steps

After identifying components for refactoring:

1. Create subtasks for each major component to be refactored
2. Apply the refactoring strategies outlined in PHAR-353
3. Update tests to match the refactored components
4. Run the analyzer again to verify improvements
