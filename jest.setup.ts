/**
 * Purpose: Set up Jest testing environment
 * Used in: All test files
 * Notes: Configures Jest with Testing Library and adds custom matchers
 */

import '@testing-library/jest-dom'

// Mock window.matchMedia which is not implemented in Jest
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }
}

// Silence React 18 console warnings during tests
const originalConsoleError = console.error
console.error = (...args: any[]) => {
  if (
    typeof args[0] === 'string' && 
    (args[0].includes('ReactDOM.render is no longer supported') ||
     args[0].includes('Warning:'))
  ) {
    return
  }
  originalConsoleError(...args)
} 