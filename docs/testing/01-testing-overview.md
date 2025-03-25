# Testing Overview

This document outlines the testing philosophy, principles, and approach for the VernisAI Chat application. Our testing strategy is designed to ensure high-quality, reliable code that meets user needs while being maintainable in the long term.

## Testing Philosophy

Our testing approach is built on the following principles:

1. **Test user-visible behavior**: Tests should verify that the application works for end users, focusing on visible behaviors rather than implementation details.

2. **Test isolation**: Each test should be completely isolated from others, with its own setup and teardown process, to prevent cascading failures.

3. **Mocking external dependencies**: External services and APIs should be consistently mocked to ensure test predictability and speed.

4. **Coverage is important but not at the expense of quality**: We aim for high test coverage, but well-designed, meaningful tests are more valuable than achieving arbitrary coverage numbers.

5. **Tests as documentation**: Tests should serve as living documentation of how components and services are expected to behave.

## Testing Types

### Unit Tests

Unit tests verify the correctness of individual functions, classes, and components in isolation. They are:

- Fast to execute
- Focused on single units of functionality
- Mocking dependencies when necessary
- Written by developers alongside the code

Unit tests are the foundation of our testing strategy and should comprise the majority of our tests.

### Integration Tests

Integration tests verify that different components work correctly together. They:

- Test interactions between multiple units
- Ensure proper communication between components
- May involve partial system configuration
- Catch issues that unit tests cannot detect

### End-to-End Tests

End-to-End (E2E) tests verify the entire application flow from a user's perspective. They:

- Test complete user journeys
- Run against an environment similar to production
- Use tools like Playwright to simulate real user behavior
- Are fewer in number but cover critical paths

## Testing Organization in Our Monorepo

Our monorepo structure requires a specific approach to testing:

### Shared Testing Package

We maintain a shared testing package (`@vernisai/testing`) that provides:

- Common test configurations
- Reusable test utilities
- Mock implementations for common services
- Helper functions for specific testing scenarios

This package ensures consistency across all tests in the monorepo and reduces duplication.

### Package-Specific Tests

Each package in the monorepo contains its own tests, organized as:

```
packages/package-name/
├── src/
│   └── ...
└── tests/
    ├── unit/
    │   └── ...
    └── integration/
        └── ...
```

### End-to-End Tests

End-to-end tests using Playwright are located in their own dedicated directory:

```
apps/web/
└── e2e/
    ├── fixtures/
    ├── helpers/
    └── specs/
```

## Testing Tools

We use modern, well-supported testing tools to ensure a smooth testing experience:

- **Vitest**: For unit and integration testing (faster and better integrated with our toolchain than Jest)
- **React Testing Library**: For testing React components
- **MSW (Mock Service Worker)**: For mocking API requests
- **Playwright**: For end-to-end testing
- **TypeScript**: For type safety in tests
- **Husky & lint-staged**: For running tests on commit

## Continuous Integration

All tests run in our CI/CD pipeline:

1. **Pull Request Tests**: All tests run on pull requests to prevent regressions
2. **Main Branch Tests**: All tests run after merging to main
3. **Nightly Tests**: End-to-end tests run nightly to catch issues with external dependencies

## Getting Started with Writing Tests

For detailed guidelines on writing tests:

1. Start by using the utilities from our base testing package
2. Follow the specific guidelines for the package you're working on
3. Ensure your tests are isolated and repeatable
4. Focus on testing behavior, not implementation details

See the specific documentation for each testing type for detailed examples and best practices.
