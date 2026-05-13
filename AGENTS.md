# Media Collection Tracker - Agent Guide

This guide helps AI agents work effectively in the Media Collection Tracker codebase.

## 🚀 Project Overview

A comprehensive Angular 21 application for tracking media collections (books, games, movies, shows) with PocketBase backend. Uses NGXS for state management, Tailwind CSS for styling, and follows a clean architecture pattern.

## 📁 Project Structure

```
src/
├── app/
│   ├── core/               # Shared services, utilities, base classes
│   ├── features/           # Domain logic (State, Repositories, Use Cases, Utils)
│   │   ├── series/         # Series management feature
│   │   │   ├── state/      # NGXS state management
│   │   │   ├── use-cases/  # Business logic operations
│   │   │   ├── utils/      # Utility functions and helpers
│   │   │   └── ...
│   │   ├── tags/           # Tagging system feature
│   │   │   ├── state/      # NGXS state management
│   │   │   ├── use-cases/  # Business logic operations
│   │   │   └── ...
│   │   └── volumes/        # Volume tracking feature
│   │       ├── state/      # NGXS state management
│   │       ├── use-cases/  # Business logic operations
│   │       ├── utils/      # Utility functions and helpers
│   │       └── ...
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

## 🏗 Architecture Patterns

### Clean Architecture Layers

1. **Presentation**: UI components, pages, and UI-specific services (Angular components and services)
   - **UI Services**: Local data processing for display (sorting, filtering), view state management.
2. **Features**: Domain logic organized by feature
   - **State**: NGXS state management
   - **Use Cases**: Business logic operations
   - **Utils**: Utility functions and helpers
   - **Repositories**: Data access coordination
   - **Data Sources**: Backend/mock data access
3. **Core**: Shared infrastructure and utilities

### Separation of UI and Business Logic

To maintain a clean architecture, we strictly separate UI-related logic from business logic:

- **UI Logic**: Logic that only affects how data is presented (e.g., table sorting, filtering for a specific view, toggling UI elements). This should reside in the **Presentation** layer, often in dedicated UI services or within the components themselves.
- **Business Logic**: Logic that defines domain rules, data transformations, or state changes (e.g., calculating series status, validating form data, executing feature-specific operations). This must reside in the **Features** layer (Use Cases or Utils).

### Data Flow

```
UI Components → State Actions → NGXS Store → Use Cases → Repositories → Data Sources → PocketBase
```

### Key Components

- **State**: NGXS stores manage application state
- **Use Cases**: Business logic operations
- **Utils**: Utility functions for business logic and helpers
- **Repositories**: Data access coordination
- **Data Sources**: Abstracted data access (backend/mock)
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

## 🔍 Key Files to Understand

### Entry Points

- `src/main.ts`: Application bootstrap
- `src/app/app.config.ts`: Angular providers configuration
- `src/app/app.routes.ts`: Main routing configuration

### Feature Structure (Example: Series)

- `src/app/features/series/state/series.state.ts`: NGXS state management
- `src/app/features/series/repository/series.repository.ts`: Repository pattern
- `src/app/features/series/use-cases/`: Business logic use cases
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

## ⚠️ Gotchas & Non-Obvious Patterns

### PocketBase Integration

- **Type Generation**: `npm run typegen` must be run after schema changes
- **Data Source Pattern**: Backend vs Mock data sources are switched automatically
- **Collections**: Multiple PocketBase collections represent different views of same data
- **Mock Implementations**: Every data source should have a corresponding mock implementation for development without PocketBase

### State Management

- **Multiple State Slices**: Series are categorized into incomplete, orphaned (incomplete but without any missing volumes), and completed
- **State Operators**: Uses NGXS patch operators for immutable updates
- **Action Handlers**: Components subscribe to action lifecycle (dispatched/completed/successful)

### UI Patterns

- **View Modes**: Components adapt behavior based on `SeriesViewMode` enum
- **Color Hashing**: Automatic color generation from text using `HashedTextColors`
- **Modal Dialogs**: Reusable modal component pattern

### Data Flow Complexity

- **Series-Volume Relationship**: Adding volumes can change series state (orphaned → incomplete)
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

- **Development**: Uses mock data source if PocketBase not available
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
4. **Data Flow**: Follow actions from UI → State → Use Case → Repository → Data Source
5. **Business Logic**: Check utility functions in `features/*/utils/` for domain-specific logic
