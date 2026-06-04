# Media Collection Tracker - Agent Guide

This guide helps AI agents work effectively in the Media Collection Tracker codebase.

## 🚀 Project Overview

A comprehensive Angular 21 application for tracking media collections (books, games, movies, shows) with PocketBase backend. Uses NGXS for state management, Tailwind CSS for styling, and follows a clean architecture pattern.

## 📁 Project Structure

```
src/
├── app/
│   ├── core/               # Shared services, utilities, base classes
│   │   └── errors/         # Error hierarchy system (BaseError, FeatureError, layer-specific errors)
│   ├── features/           # Domain logic (State, Repositories, Use-Cases, Utils)
│   │   ├── series/         # Series management feature
│   │   │   ├── state/      # NGXS state management
│   │   │   ├── use-cases/  # Business logic operations
│   │   │   ├── utils/      # Utility functions and helpers
│   │   │   └── errors/     # Series-specific errors
│   │   ├── tags/           # Tagging system feature
│   │   │   ├── state/      # NGXS state management
│   │   │   ├── use-cases/  # Business logic operations
│   │   │   └── errors/     # Tags-specific errors
│   │   └── volumes/        # Volume tracking feature
│   │       ├── state/      # NGXS state management
│   │       ├── use-cases/  # Business logic operations
│   │       ├── utils/      # Utility functions and helpers
│   │       └── errors/     # Volumes-specific errors
│   └── presentation/       # UI Components and Pages
│       ├── components/     # Reusable UI components
│       └── pages/          # Page components
├── environments/           # Environment configurations
└── pocketbase-types.ts     # Auto-generated PocketBase types
```

## 🔧 Essential Commands

### Development

```bash
npm start              # Start PocketBase + Angular dev server
npm run start:mock    # Start with mock data
npm run typegen       # Generate PocketBase TypeScript types
```

### Build & Quality

```bash
npm run build         # Production build
npm run lint          # Run ESLint
npm run format        # Run Prettier
```

### Testing

```bash
npm test              # Run all tests with Jest
npm test:watch       # Run tests in watch mode
npm test:coverage    # Run tests with coverage report
```

## 🏗 Architecture Patterns

### Clean Architecture Layers

1. **Presentation**: UI components, pages, and UI-specific services (Angular components and services)
   - **UI Services**: Local data processing for display (sorting, filtering), view state management.
2. **Features**: Domain logic organized by feature
   - **State**: NGXS state management
   - **Use-Cases**: Business logic operations
   - **Utils**: Utility functions and helpers
   - **Repositories**: Data access coordination
   - **Data-Sources**: Backend/mock data access
3. **Core**: Shared infrastructure and utilities

### Separation of UI and Business Logic

To maintain a clean architecture, we strictly separate UI-related logic from business logic:

- **UI Logic**: Logic that only affects how data is presented (e.g., table sorting, filtering for a specific view, toggling UI elements). This should reside in the **Presentation** layer, often in dedicated UI services or within the components themselves.
- **Business Logic**: Logic that defines domain rules, data transformations, or state changes (e.g., calculating series status, validating form data, executing feature-specific operations). This must reside in the **Features** layer (Use-Cases or Utils).

### Stupid Components and Intelligent Pages

Components should only implement simple UI logic that is scoped to the component's responsibility.
Every complex UI or business logic should be implemented in the pages instead.
This approach allows for a clear separation of concerns and promotes reusability.
If a component needs to trigger a complex operation, it should have a corresponding output.
If there are nested components, those outputs need to be forwarded until they reach a page where a proper handler can be implemented.

### Data Flow

```
UI Components → State Actions → NGXS Store → Use-Cases → Repositories → Data-Sources → PocketBase
```

### Key Components

- **State**: NGXS stores manage application state
- **Use-Cases**: Business logic operations
- **Utils**: Utility functions for business logic and helpers
- **Repositories**: Data access coordination
- **Data-Sources**: Abstracted data access (backend/mock)
- **Models**: Domain objects with business logic

## 📝 Code Conventions

### Naming

- **Files**: `kebab-case` (e.g., `series-card.component.ts`)
- **Classes**: `PascalCase` (e.g., `SeriesModel`)
- **Methods**: `camelCase` (e.g., `getAllSeries()`)
- **Actions**: NGXS actions use dot notation (e.g., `Series.GetAll`)

### TypeScript

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Imports**: Grouped by source (Angular, third-party, local)
- **Decorators**: `@Injectable`, `@Component`, `@State` used extensively
- **Readonly**: Use `readonly` for class properties and inputs where possible
- **Dependency Injection**: Prefer `inject()` over constructor injection

### Angular Signals & Change Detection

- **Heavily Used**: Components use Signals extensively (`input()`, `output()`, `signal()`, `effect()`)
- **Forms**: Signal-based forms using `@angular/forms/signals` package
- **Reactivity**: Signal-based approach for local component state
- **Change Detection Strategy**: All presentation components use `ChangeDetectionStrategy.OnPush` for optimal performance
  - Components only update when inputs change, events occur, or Signals emit new values
  - Works perfectly with the Signals-based architecture
  - Dramatically reduces unnecessary change detection cycles

### Typing Utilities

- **Custom Utilities**: Project includes `RemoveMethods` and `ExcludeSuperProperties` for complex TypeScript mappings
- **Base Classes**: Domain models should inherit from appropriate base classes (e.g., `HashedTextColors` for color hashing)

### Angular Specific

- **Component Structure**: Prefer three-file components (HTML, CSS, and TS) instead of inlining templates or styles in the TS file.
- **Change Detection**: Uses `provideZonelessChangeDetection()`
- **Forms**: Signal-based forms with `@angular/forms/signals`
- **Routing**: Feature-based lazy loading with route files
- **i18n**: Uses `@ngx-translate/core` for translations

### Internationalization (i18n)

- **Library**: `@ngx-translate/core` with HTTP loader (`@ngx-translate/http-loader`)
- **Configuration**: Set up in `src/app/app.config.ts:31-40` with automatic language detection from browser settings
- **Translation Files**: Located in `public/i18n/` directory with JSON files per language (e.g., `en.json`, `de.json`)
- **Fallback Language**: English (`en`)
- **Usage in Components**: Import `TranslatePipe` and `TranslateService` from `@ngx-translate/core`

#### Translation Keys Structure

Translation keys follow a hierarchical naming convention that mirrors the component/page structure:

```
components/
  core/
    nav-bar/
      series-nav/
        title: "Series"
  series/
    series-card/
      properties/
        orphaned: "Orphaned"
pages/
  series/
    incomplete/
      no-series-message: "No incomplete series"
common/
  buttons/
    save: "Save"
titles/
  series/
    incomplete: "{{applicationName}} – Incomplete Series"
```

**Key Naming Practices**:

- **Hierarchical**: Keys are nested objects that follow the project structure (components → feature → specific element)
- **Feature-based**: Grouped by feature area (series, volumes, tags, core)
- **Contextual**: Each component has its own namespace within the hierarchy
- **Consistent**: The same keys exist across all language files
- **Parameterized**: Uses `{{paramName}}` syntax for dynamic values (e.g., page titles)

**Adding New Translations**:

1. Add the key to all language JSON files in `public/i18n/`
2. Use the key in templates with `{{ 'key.path' | translate }}` or in components via `TranslateService`

## 🔍 Key Files to Understand

### Entry Points

- `src/main.ts`: Application bootstrap
- `src/app/app.config.ts`: Angular providers configuration
- `src/app/app.routes.ts`: Main routing configuration

### Feature Structure (Example: Series)

- `src/app/features/series/state/series.state.ts`: NGXS state management
- `src/app/features/series/repository/series.repository.ts`: Repository pattern
- `src/app/features/series/use-cases/`: Business logic use-cases
- `src/app/features/series/data-sources/`: Data access abstraction
- `src/app/features/series/model/series.model.ts`: Domain model

### Presentation Layer (Example: Series)

- `src/app/presentation/pages/series/`: Series-related pages
- `src/app/presentation/components/series/`: Series UI components
- `src/app/presentation/components/core/`: Shared UI components

## 🎯 Testing Approach

- **Linting**: ESLint with Angular-specific rules
- **Type Safety**: Strict TypeScript configuration
- **State Management**: NGXS actions and selectors tested through component interactions
- **Unit Testing**: Jest with `jest-preset-angular` for testing feature states and business logic
- **State Testing**: Feature states are tested in isolation using `NgxsModule.forRoot()` with mocked dependencies

## ⚠️ Gotchas & Non-Obvious Patterns

### Error Handling System

The application uses a structured error hierarchy following the pattern `feature.domain.code`:

- **Feature**: The feature module (series, volumes, tags)
- **Domain**: The architectural layer (data-source, repository, use-case)
- **Code**: Specific error type in kebab-case

All errors extend from `BaseError` and support i18n through translation keys following `errors.{feature}.{domain}.{error-code}`.

The `FeatureDomain` enum uses kebab-case values (`data-source`, `repository`, `use-case`) and the BUSINESS domain has been removed.

For detailed information, see [ERROR_HIERARCHY.md](src/app/core/errors/ERROR_HIERARCHY.md).

### PocketBase Integration

- **Type Generation**: `npm run typegen` must be run after schema changes
- **Data-Source Pattern**: Backend vs. Mock data-sources are switched automatically
- **Collections**: Multiple PocketBase collections represent different views of the same data
- **Mock Implementations**: Every data-source should have a corresponding mock implementation for development without PocketBase

### State Management

- **Multiple State Slices**: Series are categorized into incomplete, orphaned (incomplete but without any missing volumes), and completed
- **State Operators**: Uses NGXS patch operators for immutable updates
- **Action Handlers**: Components subscribe to action lifecycle (dispatched/completed/successful)

### UI Patterns

- **View Modes**: Components adapt behavior based on `SeriesViewMode` enum
- **Color Hashing**: Automatic color generation from text using `HashedTextColors`
- **Modal Dialogs**: Reusable modal component pattern

### Data Flow Complexity

- **Series-Volume Relationship**: Adding volumes can change the series state (orphaned → incomplete)
- **Tag System**: Both series and volumes have separate tag systems
- **Media Types**: Enum-based media type system (Book, Game, Movie, Show)

### Utility Pattern

- **Utils Layer**: Simple business logic and helper functions are placed in `utils/` directories
- **Static Methods**: Utility classes use static methods for lightweight, stateless operations
- **Separation of Concerns**: Keeps state management clean by extracting business logic to utilities

## 🔗 Key Dependencies

- **State**: `@ngxs/store` with `@ngxs/router-plugin`
- **Forms**: `@angular/forms/signals` for reactive forms
- **i18n**: `@ngx-translate/core` with HTTP loader
- **Icons**: `@ng-icons/core` with Heroicons
- **Styling**: `tailwindcss` with `daisyui` components
- **Backend**: `pocketbase` with type generation

## 🌐 Environment Configuration

- **Development**: Uses a mock data-source if PocketBase not available
- **Production**: Connects to PocketBase backend
- **Configuration**: Environment-specific files in `src/environments/`

## 📦 Build & Deployment

- **Docker**: Multi-stage build combining Angular frontend and PocketBase backend
- **Production Build**: `npm run build` includes type generation
- **Development**: Concurrent PocketBase and Angular servers

## 🔍 Debugging Tips

1. **State Issues**: Check NGXS devtools (enabled in development mode)
2. **Type Errors**: Run `npm run typegen` if PocketBase schema changed
3. **Routing Problems**: Verify route configurations in feature route files
4. **Data Flow**: Follow actions from UI → State → Use-Case → Repository → Data-Source
5. **Business Logic**: Check utility functions in `features/*/utils/` for domain-specific logic
