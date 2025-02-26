import { Exam, ExamStatus, ExamAttempt, UserAnswer, ExamResult } from '../model/mcqTypes';
import { logger } from '@/shared/lib/logger';
import { adaptBackendExam, BackendExam } from './adapter';

// Debug utility function - helps diagnose API issues in development
const logApiRequest = (method: string, url: string, options: Record<string, any>) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🔍 API Request: ${method} ${url}`);
    console.log('Headers:', options.headers);
    console.log('Credentials:', options.credentials);
    if (options.body) console.log('Body:', options.body);
    console.groupEnd();
  }
};

// Function to get the auth token from local storage or cookies
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    // Check different possible token storage locations
    const token = localStorage.getItem('auth_token') || 
                  localStorage.getItem('token') || 
                  localStorage.getItem('jwtToken') || 
                  sessionStorage.getItem('auth_token') || 
                  sessionStorage.getItem('token') || 
                  getCookieValue('auth_token') || 
                  getCookieValue('token') || 
                  getCookieValue('JSESSIONID');
    
    // Log token source for debugging
    if (process.env.NODE_ENV === 'development') {
      if (token) {
        console.log('Found authentication token:', token.substring(0, 10) + '...');
      } else {
        console.warn('No authentication token found in storage');
      }
    }
    
    return token;
  }
  return null;
};

// Helper function to get cookie values
const getCookieValue = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
};

// Function to add auth header to request options
const addAuthHeader = (options: Record<string, any>): Record<string, any> => {
  const token = getAuthToken();
  
  if (token) {
    // Check if the token has already a format (like "Bearer xxxxx")
    const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    
    options.headers = {
      ...options.headers,
      'Authorization': formattedToken
    };
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Added authorization header:', formattedToken.substring(0, 15) + '...');
    }
  } else {
    // Try to extract token from cookies directly for the request
    const cookieToken = extractTokenFromCookie();
    if (cookieToken) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${cookieToken}`
      };
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Added authorization header from cookie:', `Bearer ${cookieToken.substring(0, 10)}...`);
      }
    } else {
      // Try PGADMIN cookie extraction - this is specific to your screenshot
      const pgadminToken = extractTokenFromPgAdmin();
      if (pgadminToken) {
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${pgadminToken}`
        };
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Added authorization header from PGADMIN cookie:', `Bearer ${pgadminToken.substring(0, 10)}...`);
        }
      } else {
        // Try JSESSIONID as-is
        const jsessionId = getCookieValue('JSESSIONID');
        if (jsessionId) {
          options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${jsessionId}`
          };
          
          if (process.env.NODE_ENV === 'development') {
            console.log('Added authorization header using JSESSIONID directly');
          }
        } else {
          console.warn('No authentication token available');
        }
      }
    }
  }
  
  return options;
};

// Extract token from the PGADMIN_LANGUAGE cookie from screenshot
const extractTokenFromPgAdmin = (): string | null => {
  const pgCookie = getCookieValue('PGADMIN_LANGUAGE');
  if (!pgCookie) return null;
  
  try {
    // From the screenshot, it appears the token is in the format:
    // PGADMIN_LANGUAGE=en; ldea-a5bbf6a6=b247e5dd-890a-4260-843f-3f1847bbab05; JSESSIONID=78C608F5BEEC8CB5578A206C6005788; next-auth.csrf-token=...
    const sessionId = getCookieValue('JSESSIONID');
    const ldea = getCookieValue('ldea-a5bbf6a6');
    
    if (sessionId) return sessionId;
    if (ldea) return ldea;
    
    // If we found something that looks like a JWT token in the cookie value
    const matches = pgCookie.match(/([\w-]+\.[\w-]+\.[\w-]+)/);
    if (matches && matches[1]) {
      return matches[1];
    }
  } catch (e) {
    console.error('Error extracting token from PGADMIN cookie:', e);
  }
  
  return null;
};

// Helper to extract token from document.cookie directly
const extractTokenFromCookie = (): string | null => {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    // Check if this cookie contains a token
    if (value && (name.includes('token') || name.includes('auth') || name.includes('jwt'))) {
      return value;
    }
    // Check if value might contain a token
    if (value && value.includes('eyJ')) {
      return value; // Likely a JWT token (they start with eyJ)
    }
  }
  return null;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
const API_URL = `${API_BASE_URL}/api/exams`;

// Debug flag - enable to see token extraction details in the console
const DEBUG_AUTH = true;

// Export this function to allow other modules to use the same token extraction
export const getAuthorizationHeader = (): string | null => {
  // Try all token sources
  const token = getAuthToken();
  if (token) {
    return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }
  
  const cookieToken = extractTokenFromCookie();
  if (cookieToken) {
    return `Bearer ${cookieToken}`;
  }
  
  const pgToken = extractTokenFromPgAdmin();
  if (pgToken) {
    return `Bearer ${pgToken}`;
  }
  
  const jsessionId = getCookieValue('JSESSIONID');
  if (jsessionId) {
    return `Bearer ${jsessionId}`;
  }
  
  return null;
};

// Utility function to update auth headers in all requests
const injectAuthForDebugging = () => {
  if (!DEBUG_AUTH || typeof window === 'undefined') return;
  
  // This is for debugging only
  const originalFetch = window.fetch;
  window.fetch = function(input, init) {
    if (!init) init = {};
    if (!init.headers) init.headers = {};
    
    const authHeader = getAuthorizationHeader();
    if (authHeader && !init.headers['Authorization']) {
      // @ts-ignore
      init.headers['Authorization'] = authHeader;
      console.log('DEBUG: Injected auth header into fetch request', input);
    }
    
    return originalFetch.apply(this, [input, init]);
  };
  
  console.log('DEBUG: Initialized auth header injection for all fetch requests');
};

// Call this once to setup debugging
if (typeof window !== 'undefined') {
  setTimeout(injectAuthForDebugging, 500); // Wait a bit for everything to initialize
}

// Use browser-friendly fetch instead of axios to avoid Node.js dependencies
export const examService = {
  // Get all exams
  async getAllExams(): Promise<Exam[]> {
    try {
      logger.info('Fetching all exams');
      
      let options = {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      };
      
      // Add authentication headers
      options = addAuthHeader(options);
      
      // Log request details in development
      logApiRequest('GET', API_URL, options);
      
      const response = await fetch(API_URL, options);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }
      
      const backendExams: BackendExam[] = await response.json();
      const exams = backendExams.map(adaptBackendExam);
      
      logger.info('Successfully fetched all exams', { count: exams.length });
      return exams;
    } catch (error) {
      const isCorsError = error instanceof TypeError && error.message.includes('CORS');
      
      logger.error('Failed to fetch all exams', {
        error: error instanceof Error ? error.message : 'Unknown error',
        apiUrl: API_URL,
        isCorsError,
        origin: typeof window !== 'undefined' ? window.location.origin : 'unknown'
      });
      
      // Rethrow with more helpful message if it's a CORS error
      if (isCorsError) {
        throw new Error(
          `CORS error: The backend server at ${API_BASE_URL} is rejecting requests from ${typeof window !== 'undefined' ? window.location.origin : 'this origin'}. ` +
          'Check your CORS configuration in SecurityConfig.java.'
        );
      }
      
      throw error;
    }
  },

  // Get published exams only
  async getPublishedExams(): Promise<Exam[]> {
    try {
      logger.info('Fetching published exams', { url: `${API_URL}/published` });
      
      let options = {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        credentials: 'include'
      };
      
      // Add authentication headers
      options = addAuthHeader(options);
      
      // Log request details in development
      logApiRequest('GET', `${API_URL}/published`, options);
      
      const response = await fetch(`${API_URL}/published`, options);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }
      
      const backendExams: BackendExam[] = await response.json();
      const exams = backendExams.map(adaptBackendExam);
      
      logger.info('Successfully fetched published exams', { count: exams.length });
      return exams;
    } catch (error) {
      const isCorsError = error instanceof TypeError && error.message.includes('CORS');
      
      logger.error('Failed to fetch published exams', {
        error: error instanceof Error ? error.message : 'Unknown error',
        apiUrl: API_URL,
        isCorsError,
        origin: typeof window !== 'undefined' ? window.location.origin : 'unknown'
      });
      
      // Rethrow with more helpful message if it's a CORS error
      if (isCorsError) {
        throw new Error(
          `CORS error: The backend server at ${API_BASE_URL} is rejecting requests from ${typeof window !== 'undefined' ? window.location.origin : 'this origin'}. ` +
          'Check your CORS configuration in SecurityConfig.java.'
        );
      }
      
      throw error;
    }
  },

  // Get exam by ID
  async getExamById(id: number): Promise<Exam> {
    try {
      logger.info('Fetching exam by ID', { examId: id });
      
      let options = {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      };
      
      // Add authentication headers
      options = addAuthHeader(options);
      
      // Log request details in development
      logApiRequest('GET', `${API_URL}/${id}`, options);
      
      const response = await fetch(`${API_URL}/${id}`, options);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }
      
      const backendExam: BackendExam = await response.json();
      const exam = adaptBackendExam(backendExam);
      
      return exam;
    } catch (error) {
      logger.error(`Failed to fetch exam with ID ${id}`, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  },

  // Start an exam attempt
  async startExam(examId: number): Promise<ExamAttempt> {
    try {
      logger.info('Starting exam attempt', { examId });
      
      let options = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      };
      
      // Add authentication headers
      options = addAuthHeader(options);
      
      // Log request details in development
      logApiRequest('POST', `${API_URL}/${examId}/start`, options);
      
      const response = await fetch(`${API_URL}/${examId}/start`, options);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      logger.error(`Failed to start exam with ID ${examId}`, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  },

  // Submit an exam attempt
  async submitExam(attemptId: number, answers: UserAnswer[]): Promise<ExamResult> {
    try {
      logger.info('Submitting exam attempt', { attemptId, answersCount: answers.length });
      
      let options = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ answers })
      };
      
      // Add authentication headers
      options = addAuthHeader(options);
      
      // Log request details in development
      logApiRequest('POST', `${API_URL}/attempts/${attemptId}/submit`, options);
      
      const response = await fetch(`${API_URL}/attempts/${attemptId}/submit`, options);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      logger.error(`Failed to submit exam attempt`, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  },

  // Get exams by status
  async getExamsByStatus(status: ExamStatus): Promise<Exam[]> {
    try {
      logger.info('Fetching exams by status', { status });
      
      let options = {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      };
      
      // Add authentication headers
      options = addAuthHeader(options);
      
      // Log request details in development
      logApiRequest('GET', `${API_URL}/status/${status}`, options);
      
      const response = await fetch(`${API_URL}/status/${status}`, options);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }
      
      const backendExams: BackendExam[] = await response.json();
      const exams = backendExams.map(adaptBackendExam);
      
      return exams;
    } catch (error) {
      logger.error(`Failed to fetch exams with status ${status}`, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }
};
