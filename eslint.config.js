const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const rxjs = require('@rxlint/eslint-plugin');
const rxjsAngular = require('@rxlint/eslint-plugin-angular');
const eslintConfigPrettier = require('eslint-config-prettier');
const simpleImportSort = require('eslint-plugin-simple-import-sort');

const codeStyle = {
  quotes: [2, 'single', { avoidEscape: true }],
  'no-alert': 'error',
  'no-debugger': 'error',
  'no-console': ['error', { allow: ['error'] }],
  'no-warning-comments': ['warn', { terms: ['todo'], location: 'anywhere' }],
  'no-await-in-loop': 'error',
  'no-constant-binary-expression': 'error',
  'no-constructor-return': 'error',
  'no-duplicate-imports': 'error',
  'no-promise-executor-return': 'error',
  'no-self-compare': 'error',
  'no-template-curly-in-string': 'error',
  '@typescript-eslint/no-namespace': 'off',
  '@typescript-eslint/explicit-function-return-type': 'error',
  '@rxlint/no-unsafe-takeuntil': 'error',
  'simple-import-sort/imports': 'error',
  'simple-import-sort/exports': 'error',
};

const commonExtends = [
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  ...angular.configs.tsRecommended,
  rxjs.configs.recommendedTypeChecked,
  eslintConfigPrettier,
];

module.exports = tseslint.config(
  {
    ignores: ['.angular/**', '.nx/**', 'coverage/**', 'dist/**', 'src/pocketbase-types.ts'],
  },
  {
    files: ['src/**/*.ts'],
    extends: commonExtends,
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    processor: angular.processInlineTemplates,
    plugins: {
      '@rxlint-angular': rxjsAngular,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/component-class-suffix': [
        'error',
        {
          suffixes: ['Page', 'Component'],
        },
      ],
      '@rxlint-angular/prefer-takeuntil': 'error',
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',
      '@typescript-eslint/unbound-method': ['error', { ignoreStatic: true }],
      ...codeStyle,
    },
  },
  {
    files: ['src/**/*.spec.ts'],
    extends: commonExtends,
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      '@typescript-eslint/unbound-method': 'off',
      ...codeStyle,
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended],
    rules: {},
  },
);
