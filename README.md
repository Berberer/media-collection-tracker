<p align="center">
  <img src="public/favicon.svg" alt="Project Icon" height="256" />
</p>

# Media Collection Tracker

Application for tracking media collections (books, games, movies, shows), built with Angular 21 and PocketBase.

## 🚀 Overview

This tool helps you manage your physical and digital media collections.
It allows you to organize items into series, track missing volumes, and tag items for better categorization.

### Key Features

- **Series Management**: Track incomplete, orphaned, or completed series.
- **Volume Tracking**: Dashboard for missing and collected volumes.
- **Tagging System**: Flexible tagging for both series and individual volumes.
- **Multi-language Support**: i18n support (English and German included so far).
- **Included Backend**: Powered by PocketBase for real-time data and easy deployment.

---

- [🛠 Technologies](#-technologies)
- [📋 Requirements](#-requirements)
- [⚙️ Setup & Installation](#-setup--installation)
  - [Git Hooks](#git-hooks)
- [🏃 Running the Application](#-running-the-application)
  - [Development Server](#development-server)
  - [Mock Mode](#mock-mode)
- [📜 Available Scripts](#-available-scripts)
- [🏗 Project Structure](#-project-structure)
- [🐳 Docker](#-docker)
  - [Manual Docker Build](#manual-docker-build)
  - [Docker Compose](#docker-compose)
- [🌍 Environment Configuration](#-environment-configuration)
- [📄 License](#-license)

---

## 🛠 Technologies

- **Frontend**: [Angular 21](https://angular.dev/)
- **State Management**: [NGXS](https://www.ngxs.io/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & [daisyUI 5](https://daisyui.com/)
- **Backend/Database**: [PocketBase](https://pocketbase.io/)
- **Icons**: [Heroicons](https://heroicons.com/) via [ng-icons](https://ng-icons.github.io/ng-icons/)
- **Testing**: [Jest](https://jestjs.io/) with [jest-preset-angular](https://github.com/thymikee/jest-preset-angular)
- **Development Environment** (_optional_): [Nix Flake](https://nixos.org/)

---

## 📋 Requirements

- **Node.js** (v24+)
- **npm** (v11+)
- **PocketBase**

---

## ⚙️ Setup & Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Berberer/media-collection-tracker.git
   cd media-collection-tracker
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Database Setup**:
   Ensure you have the `pb_data` and `pb_migrations` folders.
   If starting fresh, PocketBase will initialize these on the first run.

### Git Hooks

This project uses [Husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/lint-staged/lint-staged) to automatically run Prettier formatting, ESLint linting, and Jest tests before each commit.
Git hooks are automatically installed when running `npm install` – no manual setup required.
Commits will be blocked if linting fails or tests don't pass.

---

## 🏃 Running the Application

### Development Server

To start both the PocketBase backend and the Angular development server:

```bash
npm start
```

- PocketBase will be available at `http://localhost:8090/_/`
- Angular application will be available at `http://localhost:4200/`

### Mock Mode

To run the application with mock data (if configured):

```bash
npm run start:mock
```

---

## 📜 Available Scripts

- `npm start`: Runs `typegen`, then starts PocketBase and `ng serve` concurrently.
- `npm run start:mock`: Runs `typegen`, then starts `ng serve` with mock configuration.
- `npm run typegen`: Generates TypeScript definitions from the PocketBase schema.
- `npm run build`: Builds the production-ready Angular application.
- `npm run lint`: Runs ESLint for code quality checks.
- `npm run format`: Runs Prettier for code formatting.
- `npm test`: Runs unit tests with Jest.
- `npm run test:watch`: Runs tests in watch mode.
- `npm run test:coverage`: Runs tests with coverage report.
- `npm run release`: Bumps version, update CHANGELOG.md, and creates new git tag for the release.

---

## 🏗 Project Structure

```text
├── pb_data/                 # PocketBase database files
├── pb_migrations/           # PocketBase schema migrations
├── public/                  # Static assets (i18n, icons, etc.)
├── src/
│   ├── app/
│   │   ├── core/            # Shared services, utilities, and base classes
│   │   ├── features/        # Domain logic (State, Repositories, Use-Cases)
│   │   │   ├── series/
│   │   │   ├── tags/
│   │   │   └── volumes/
│   │   └── presentation/    # UI Components and Pages
│   │       ├── components/
│   │       └── pages/
│   ├── environments/        # Environment-specific configurations
│   └── assets/              # App-specific assets
├── Dockerfile               # Multi-stage build for PB + Angular
├── angular.json             # Angular CLI configuration
└── package.json             # Node.js dependencies and scripts
```

---

## 🐳 Docker

You can build and run the entire stack using Docker:

### Manual Docker Build

```bash
docker build -t media-collection-tracker .
docker run -p 8090:8090 \
  -v $(pwd)/pb_data:/pb_data \
  -e PB_ADMIN_EMAIL=admin@example.com \
  -e PB_ADMIN_PASSWORD=MySecretAdminPassword123 \
  media-collection-tracker
```

### Docker Compose

Alternatively, use the provided `docker-compose.yaml`:

```bash
docker compose up -d
```

The Docker image bundles both the Angular frontend (served by PocketBase) and the PocketBase backend itself.

---

## 🌍 Environment Configuration

Configuration is handled via Angular environment files in `src/environments/`:

- `production`: Boolean flag for production mode.
- `backendUrl`: URL for the PocketBase API (e.g., `http://localhost:8090`).
- `appTitle`: The display name of the application.

---

## 📄 License

This project is licensed under the MIT License – see the [LICENSE.md](LICENSE.md) file for details.

---
