"use client";

/**
 * Theme Example
 * 
 * Example component that demonstrates how to use the ThemeContext.
 */
import React from 'react';
import { ThemeProvider, useTheme, ThemeMode } from '../context/ThemeContext';

/**
 * Theme switcher component
 */
function ThemeSwitcher() {
  const { theme, setTheme, isDarkMode, toggleTheme } = useTheme();
  
  return (
    <div className="theme-switcher">
      <h3>Theme Settings</h3>
      
      <div className="theme-mode-selector">
        <div className="theme-options">
          {(['light', 'dark', 'system'] as ThemeMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setTheme(mode)}
              className={theme === mode ? 'active' : ''}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="theme-toggle">
        <button onClick={toggleTheme}>
          Toggle theme (currently: {isDarkMode ? 'Dark' : 'Light'})
        </button>
      </div>
      
      <div className="theme-info">
        <p>Current theme: {theme}</p>
        <p>Dark mode: {isDarkMode ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
}

/**
 * Theme example component
 */
export function ThemeExample() {
  return (
    <ThemeProvider>
      <div className="theme-example">
        <h2>Theme Example</h2>
        <p>This example demonstrates the ThemeContext in action.</p>
        
        <ThemeSwitcher />
        
        <div className="theme-preview">
          <h3>Preview</h3>
          <div className="sample-card">
            <h4>Sample Card</h4>
            <p>This card will change appearance based on the selected theme.</p>
            <button>Sample Button</button>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default ThemeExample;