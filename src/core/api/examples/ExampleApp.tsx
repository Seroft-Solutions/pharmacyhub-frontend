/**
 * Example App
 * 
 * This file demonstrates how to set up the QueryClientProvider at the application level.
 * In a real app, this would be in your main _app.tsx file.
 */
import React from 'react';
import { QueryClientProvider } from '../providers/QueryClientProvider';
import { UserManager } from './UserManager';

/**
 * Example application with TanStack Query integration
 */
export function ExampleApp() {
  return (
    <QueryClientProvider 
      // Enable DevTools in development
      includeDevtools={process.env.NODE_ENV === 'development'}
      // Customize stale time (5 minutes)
      defaultStaleTime={5 * 60 * 1000}
      // Customize garbage collection time (10 minutes)
      defaultGcTime={10 * 60 * 1000}
    >
      <div>
        <header>
          <h1>PharmacyHub Admin</h1>
          <nav>
            <ul>
              <li>Dashboard</li>
              <li>Users</li>
              <li>Products</li>
              <li>Orders</li>
            </ul>
          </nav>
        </header>
        
        <main>
          {/* User management example component */}
          <UserManager />
        </main>
        
        <footer>
          <p>&copy; 2025 PharmacyHub Admin</p>
        </footer>
      </div>
    </QueryClientProvider>
  );
}

export default ExampleApp;