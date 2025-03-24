# VernisAI Chat Testing Documentation

Welcome to the testing documentation for the VernisAI Chat application. This documentation provides guidelines and best practices for implementing tests across the different packages in our monorepo.

## Testing Pyramid

We follow the testing pyramid approach to ensure comprehensive test coverage:

1. **Unit Tests**: Low-level tests focusing on small, isolated parts of the codebase.
2. **Integration Tests**: Testing the interaction between different parts of the application.
3. **End-to-End Tests**: Testing the entire application from the user's perspective.

## Directory Structure

Each package in our monorepo has its own `tests` directory with the following structure:

```
package/
├── src/
│   └── ...
└── tests/
    ├── unit/
    │   └── ...
    └── integration/
        └── ...
```

The root of the monorepo also contains an `e2e` directory for Playwright-based end-to-end tests.

## Key Testing Tools

- **Vitest**: Primary test runner and assertion library
- **React Testing Library**: Testing React components
- **Playwright**: End-to-end testing
- **MSW (Mock Service Worker)**: Mocking API requests
- **Testing Library User Event**: Simulating user interactions

## Documentation Index

1. [Testing Overview](./01-testing-overview.md)
2. [Base Testing Package](./02-base-testing-package.md)
3. [Unit Testing](./03-unit-testing.md)
4. [API Testing](./04-api-testing.md)
5. [Database Testing](./05-database-testing.md)
6. [Proxy Testing](./06-proxy-testing.md)
7. [Web Testing](./07-web-testing.md)
8. [End-to-End Testing with Playwright](./08-e2e-testing.md)

## Getting Started

To run tests for a specific package:

```bash
cd packages/package-name
npm test
```

To run all tests across the monorepo:

```bash
npm test
```

To run end-to-end tests:

```bash
npm run test:e2e
```

To run tests with coverage:

```bash
npm run test:coverage
```
