/**
 * This is a utility script to extract authorization from the PGADMIN cookie
 * Used to debug authentication issues with the PharmacyHub API
 */

// Extract token from the cookie format in the screenshot
const extractTokenFromCookie = () => {
  if (typeof document === 'undefined') return null;
  
  // First, check for JSESSIONID as it's most likely
  const jsessionId = getCookieValue('JSESSIONID');
  if (jsessionId) {
    console.log('Found JSESSIONID:', jsessionId);
    return jsessionId;
  }
  
  // Check for specific cookie observed in the screenshot
  const pgadminLang = getCookieValue('PGADMIN_LANGUAGE');
  if (pgadminLang) {
    console.log('Found PGADMIN_LANGUAGE cookie');
  }
  
  // Check for next-auth.csrf-token
  const csrfToken = getCookieValue('next-auth.csrf-token');
  if (csrfToken) {
    console.log('Found CSRF token:', csrfToken);
    return csrfToken.split('%')[0]; // Often the token is the first part
  }
  
  // Check for token in another format
  const allCookies = document.cookie;
  console.log('All cookies:', allCookies);
  
  // Look for something that might be a JWT token (they typically start with ey)
  const jwtMatch = allCookies.match(/([a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+)/);
  if (jwtMatch && jwtMatch[1]) {
    console.log('Found potential JWT token:', jwtMatch[1]);
    return jwtMatch[1];
  }
  
  return null;
};

// Helper function to get cookie values
const getCookieValue = (name) => {
  if (typeof document === 'undefined') return null;
  
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
};

// Show the token in the console
const showToken = () => {
  const token = extractTokenFromCookie();
  if (token) {
    console.log('Authorization header to use:', `Bearer ${token}`);
  } else {
    console.log('No suitable token found in cookies');
  }
  
  // Check localStorage options
  const localStorageKeys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    localStorageKeys.push(key);
    
    // Check if it might contain a token
    const value = localStorage.getItem(key);
    if (value && (key.includes('token') || key.includes('auth') || value.includes('ey'))) {
      console.log('Potential token in localStorage:', key, value);
    }
  }
  
  console.log('All localStorage keys:', localStorageKeys);
};

// Run the extraction
showToken();

// You can paste this entire script in your browser console to debug token issues
