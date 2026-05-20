// Global mocks for Jest
// Add any global mocks needed for your tests here

// Mock for environment
jest.mock('src/environments/environment', () => ({
  ...jest.requireActual('src/environments/environment'),
  production: false,
}));
