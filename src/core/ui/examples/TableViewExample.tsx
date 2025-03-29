"use client";

/**
 * Table View Example
 * 
 * Example component that demonstrates how to use the TableViewContext.
 */
import React from 'react';
import { TableViewProvider, useTableView } from '../context/TableViewContext';

// Sample data for the table
const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Manager', status: 'Active' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'User', status: 'Pending' },
];

// Column definitions
const columns = [
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email' },
  { id: 'role', label: 'Role' },
  { id: 'status', label: 'Status' },
];

/**
 * Table component that uses the TableViewContext
 */
function Table() {
  const { 
    columnVisibility, 
    setColumnVisibility, 
    resetColumnVisibility,
    sort,
    setSort,
    clearSort,
    density,
    setDensity
  } = useTableView();
  
  // Get visible columns
  const visibleColumns = columns.filter(
    column => columnVisibility[column.id] !== false
  );
  
  // Sort the data
  const sortedData = [...data].sort((a, b) => {
    if (!sort) return 0;
    
    const columnId = sort.columnId as keyof typeof a;
    const valueA = a[columnId];
    const valueB = b[columnId];
    
    if (valueA < valueB) return sort.direction === 'asc' ? -1 : 1;
    if (valueA > valueB) return sort.direction === 'asc' ? 1 : -1;
    return 0;
  });
  
  return (
    <div className="table-component">
      <div className="table-controls">
        <div className="column-visibility">
          <h4>Column Visibility</h4>
          {columns.map(column => (
            <label key={column.id}>
              <input
                type="checkbox"
                checked={columnVisibility[column.id] !== false}
                onChange={(e) => setColumnVisibility(column.id, e.target.checked)}
              />
              {column.label}
            </label>
          ))}
          <button onClick={resetColumnVisibility}>Reset Columns</button>
        </div>
        
        <div className="density-controls">
          <h4>Density</h4>
          <div className="density-options">
            {(['compact', 'normal', 'spacious'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDensity(d)}
                className={density === d ? 'active' : ''}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <table className={`table-${density}`}>
        <thead>
          <tr>
            {visibleColumns.map(column => (
              <th 
                key={column.id}
                onClick={() => setSort(column.id)}
                className={sort?.columnId === column.id ? `sort-${sort.direction}` : ''}
              >
                {column.label}
                {sort?.columnId === column.id && (
                  <span>{sort.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map(row => (
            <tr key={row.id}>
              {visibleColumns.map(column => (
                <td key={column.id}>{row[column.id as keyof typeof row]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {sort && (
        <div className="sort-info">
          <p>
            Sorted by {columns.find(c => c.id === sort.columnId)?.label} ({sort.direction})
          </p>
          <button onClick={clearSort}>Clear Sort</button>
        </div>
      )}
    </div>
  );
}

/**
 * Table view example component
 */
export function TableViewExample() {
  // Default column visibility - all visible
  const defaultColumnVisibility = columns.reduce(
    (acc, column) => ({ ...acc, [column.id]: true }),
    {}
  );
  
  return (
    <TableViewProvider defaultColumnVisibility={defaultColumnVisibility} defaultDensity="normal">
      <div className="table-view-example">
        <h2>Table View Example</h2>
        <p>This example demonstrates the TableViewContext in action.</p>
        <p>You can customize the table by toggling columns, changing density, and sorting by columns.</p>
        
        <Table />
      </div>
    </TableViewProvider>
  );
}

export default TableViewExample;