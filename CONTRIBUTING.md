# Contributing to VernisAI Chat

Thank you for considering contributing to VernisAI Chat! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to maintain a respectful and productive environment for all contributors.

## Getting Started

### Development Environment Setup

1. Fork the repository and clone it locally
2. Install dependencies with `npm install`
3. Copy `.env.local.example` to `.env.local` and configure environment variables
4. Run the development server with `npm run dev`

### Project Structure

This is a monorepo managed with Turborepo. Familiarize yourself with the structure:

- `apps/web`: Main web application
- `packages/`: Shared packages (UI, API, database, etc.)
- `docs/`: Project documentation
- `changes/`: Change logs for tracking project updates

## Development Workflow

### Branch Naming

Use descriptive branch names following this format:

- `feature/short-description` for new features
- `fix/short-description` for bug fixes
- `docs/short-description` for documentation updates
- `refactor/short-description` for code refactoring

### Commit Messages

Follow conventional commit message format:

- `feat: description` for features
- `fix: description` for bug fixes
- `docs: description` for documentation
- `refactor: description` for refactoring
- `test: description` for test additions
- `chore: description` for maintenance tasks

### Pull Request Process

1. Update the documentation to reflect any changes
2. Update the change log in the `/changes` directory with a description of your changes
   - Use the format: `## [Title of Changes] - [Time]` followed by bullet points
3. Submit a pull request following the [PR template](.github/PULL_REQUEST_TEMPLATE.md)
4. Ensure all checks pass (tests, linting, build)
5. Wait for review from the maintainers

## Coding Guidelines

### TypeScript

- Prefer `type` over `interface`
- Implement type definitions in dedicated files
- Avoid using `any` types
- Document public functions and interfaces with JSDoc comments

### React

- Use functional components with hooks
- Implement data and logic in separate files from UI components
- Follow the component patterns established in the codebase
- Reuse UI components from the `@vernisai/ui` package when possible

### API Development

- Add new endpoints to the appropriate tRPC routers
- Document all endpoints with descriptive comments
- Include input and output types for all procedures
- Implement proper error handling

### Testing

- Write unit tests for new functionality
- Ensure tests pass before submitting a PR
- Update existing tests when changing behavior

## Documentation

- Keep documentation up-to-date with code changes
- Follow the existing structure in the `docs` directory
- Update the README.md when adding new features or changing configuration
- Document APIs according to OpenAPI standards

## Submitting Issues

### Bug Reports

When submitting a bug report, please use the [bug report template](.github/ISSUE_TEMPLATE/bug-report.md) and include:

- A clear description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Environment information

### Feature Requests

When submitting a feature request, please use the [feature request template](.github/ISSUE_TEMPLATE/feature-request.md) and include:

- A clear description of the problem the feature would solve
- Expected behavior
- Use cases
- Proposed solution (if you have one)
- Business impact

## Release Process

1. Changes are accumulated in the `main` branch
2. Maintainers periodically create release branches
3. After testing, releases are tagged and deployed
4. Release notes are published documenting all changes

## Questions?

If you have any questions about contributing, please reach out to the maintainers or open an issue for clarification.

Thank you for contributing to VernisAI Chat!
