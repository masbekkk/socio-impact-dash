# GEMINI.md - Project Overview: Socio-Impact-Dash

This document provides a comprehensive overview of the `socio-impact-dash` project, intended for AI agents to understand its core structure, technologies, and development conventions.

## 🚀 Project Summary

`socio-impact-dash` is an ultra-strict, type-safe web application built on the **Laravel** framework, utilizing **Inertia.js** and **React** for its frontend. It's engineered to uphold rigorous code quality standards, emphasizing type safety, immutability, and a fail-fast philosophy. The project integrates a comprehensive suite of development and quality assurance tools to ensure consistent and pristine code.

## 🛠️ Key Technologies

### Backend
*   **Framework:** Laravel (PHP 8.4+)
*   **Dependency Management:** Composer
*   **Static Analysis:** PHPStan (maximum strictness level, with Larastan extension)
*   **Code Formatting:** Pint (Laravel preset with strict rules like `declare_strict_types`, `final_class`, `strict_comparison`)
*   **Architecture:** Fully Actions-Oriented (operations encapsulated in `final readonly class` with a single `handle` method)

### Frontend
*   **Framework/Library:** React
*   **Language:** TypeScript (strict mode enabled, targeting ESNext)
*   **Bridge:** Inertia.js
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **Linting:** ESLint (configured for React, React Hooks, and integrated with Prettier)

### Testing
*   **Framework:** Pest
*   **Features:** `RefreshDatabase`, extensive mocking for HTTP requests, process execution, sleep functions, and time freezing.
*   **Coverage:** Aims for 100% code coverage.
*   **Test Types:** Organized into 'Browser', 'Feature', and 'Unit' tests.

## ⚙️ Building and Running

### Initial Setup
To set up the project locally:

1.  Navigate to the project directory.
2.  Install PHP dependencies:
    ```bash
    composer setup
    ```
3.  Install JavaScript dependencies (assuming `npm` or `yarn` is used, inferring from `node_modules` and `package.json` being present in `.gitignore`, but typically managed by `composer setup` for this starter kit):
    ```bash
    # This project typically handles JS dependencies during `composer setup`.
    # If manual installation is needed, use:
    # npm install
    # or
    # yarn install
    ```
4.  Start the development server (runs Laravel, queue worker, log monitoring, and Vite dev server concurrently):
    ```bash
    composer dev
    ```

### Optional: Browser Testing Setup
If you plan to use Pest's browser testing capabilities:

```bash
npm install playwright
npx playwright install
```

### Verification
Run the complete test suite to ensure everything is configured correctly and meets quality standards:

```bash
composer test
```
This command typically covers type coverage, unit tests, linting, and static analysis.

## 📚 Development Conventions

This project adheres to a highly opinionated set of development conventions, primarily driven by its "ultra-strict, type-safe" philosophy:

*   **Type Safety:** 100% type coverage is enforced across both PHP and TypeScript codebases.
*   **Actions-Oriented:** All significant operations are encapsulated within single-action classes, promoting clear separation of concerns and testability.
*   **Immutability:** Data structures favor immutability to prevent unexpected side effects.
*   **Fail-Fast:** Errors are designed to be caught at compile-time or as early as possible in the development cycle.
*   **Automated Quality:** Extensive use of tools like PHPStan, Pint, ESLint, and Prettier ensures consistent code style and quality.
*   **Testing:** Comprehensive testing with Pest, aiming for high code coverage, is a fundamental part of the development process.
