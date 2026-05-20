/** @type {import('ts-jest').JestConfigWithTsJest} */
const { createCjsPreset } = require('jest-preset-angular/presets');

module.exports = {
  ...createCjsPreset(),
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^app/(.*)$': '<rootDir>/src/app/$1',
  },
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['html', 'text-summary'],
  collectCoverageFrom: ['src/**/*.ts'],
  verbose: true,
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
};
