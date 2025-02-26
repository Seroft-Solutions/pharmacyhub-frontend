import '@testing-library/jest-dom';
import 'jest-fetch-mock';

// Mock globals for testing environment
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
  length: 0,
  key: jest.fn(),
};

global.localStorage = localStorageMock;

// Mock window.location
const locationMock = {
  href: '',
  pathname: '',
  assign: jest.fn(),
  replace: jest.fn(),
};

Object.defineProperty(window, 'location', {
  value: locationMock,
  writable: true
});

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  fetch.resetMocks();
  window.location.href = '';
});
