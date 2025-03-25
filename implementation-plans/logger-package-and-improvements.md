# Logger Package Implementation and Improvements

## Overview

This document outlines the plan to create a dedicated logger package for the VernisAI monorepo and implement improvements to the logging system. The goal is to provide a unified, robust logging solution that can be used across all packages while enhancing observability, performance monitoring, and security.

## Current State

Currently, the logging implementation is tightly coupled to the API package, which:

- Limits reusability across the monorepo
- Creates potential inconsistencies in logging patterns
- Makes maintenance more difficult
- Duplicates code when other packages need logging

## Proposed Solution

### 1. New Package Structure

Create a new `@vernisai/logger` package with the following structure:

```
packages/
  └── logger/
      ├── package.json
      ├── tsconfig.json
      ├── src/
      │   ├── index.ts           # Main exports
      │   ├── types/
      │   │   ├── logger.types.ts     # Core logger types
      │   │   ├── context.types.ts    # Context types
      │   │   ├── transport.types.ts  # Transport types
      │   │   └── metrics.types.ts    # Metrics types
      │   ├── core/
      │   │   ├── logger.ts      # Core logger implementation
      │   │   ├── context.ts     # Async context management
      │   │   └── metrics.ts     # Performance metrics tracking
      │   ├── transports/
      │   │   ├── logtail.ts     # Logtail transport
      │   │   ├── console.ts     # Console transport
      │   │   └── metrics.ts     # Metrics transport
      │   ├── middleware/
      │   │   ├── express.ts     # Express middleware
      │   │   └── trpc.ts        # tRPC middleware
      │   └── utils/
      │       ├── sanitizer.ts   # Data sanitization
      │       ├── formatters.ts  # Log formatting
      │       └── security.ts    # Security utilities
      └── README.md
```

### 2. Enhanced Features

#### 2.1 Performance Monitoring

- Custom Winston transport for metrics
- Performance indicators tracking:
  - Request latency distributions
  - Error rates by endpoint
  - Resource utilization
  - Database query timings
  - External API call latencies

#### 2.2 Context Tracking

- Trace IDs for request chains
- User session information
- API rate limits
- System health metrics

#### 2.3 Security Enhancements

- Advanced PII detection
- Log data encryption
- Access audit trails
- IP address anonymization
- Rate limiting logging

#### 2.4 Log Management

- Log rotation strategies
- Compression
- Retention policies
- Archival strategy
- Search optimization

## Implementation Checklist

### Phase 1: Package Setup

- [x] Create new package directory structure

  > Implemented the directory structure with proper organization of types, core, middleware, transports, and utilities.

- [x] Set up package.json with dependencies

  > Added required dependencies including Winston, Logtail, and supporting libraries. Configured proper package metadata.

- [x] Configure TypeScript (tsconfig.json)

  > Set up TypeScript configuration to ensure type safety and proper compilation of the logger package.

- [x] Set up build process

  > Configured tsup for building the package with support for CommonJS, ESM, and TypeScript declaration files.

- [x] Create README with documentation
  > Created comprehensive README with installation instructions, usage examples, and configuration options.

### Phase 2: Core Types

- [x] Create logger.types.ts

  > Defined core types for the logger interface, options, log levels, and data structures.

- [x] Create context.types.ts

  > Implemented types for request context management with support for request IDs, user data, and organization information.

- [x] Create transport.types.ts

  > Created types for transport configurations and interfaces for various output destinations.

- [x] Create metrics.types.ts
  > Defined types for performance metrics tracking, including request latency and error rates.

### Phase 3: Core Implementation

- [x] Implement base logger class

  > Implemented a Winston-based logger with customizable configuration options and log levels.

- [x] Implement async context management

  > Created context management using AsyncLocalStorage for request-scoped data tracking.

- [x] Set up Winston configuration

  > Configured Winston with appropriate formatters, transports, and error handling.

- [x] Implement metrics tracking system

  > Built a metrics manager for tracking request latency, status codes, and endpoint performance.

- [x] Create log formatters
  > Implemented formatters for development and production environments with context awareness.

### Phase 4: Transports

- [x] Implement Logtail transport

  > Added Better Stack (Logtail) integration for centralized log collection.

- [x] Implement console transport

  > Created console transport with customizable formatting for local development.

- [x] Create metrics transport

  > Implemented transport for metrics data collection and monitoring.

- [x] Add transport configuration options
  > Added comprehensive configuration options for enabling/disabling transports and customizing behavior.

### Phase 5: Security Features

- [x] Implement PII detection system

  > Created sanitization utilities to identify and redact personally identifiable information.

- [ ] Add log data encryption

  > Not implemented yet.

- [x] Create IP anonymization utility

  > Added functionality to anonymize IP addresses in logs for privacy.

- [ ] Implement audit logging

  > Not implemented yet.

- [ ] Add rate limit tracking
  > Not implemented yet.

### Phase 6: Middleware

- [x] Create Express middleware

  > Implemented middleware for Express applications with request ID tracking, timing, and context management.

- [x] Create tRPC middleware

  > Created middleware for tRPC procedures with proper logging of requests, responses, and errors.

- [x] Add request tracking

  > Implemented request tracking with unique identifiers and timing information.

- [x] Implement performance monitoring
  > Added performance monitoring capabilities to middleware for tracking request latency.

### Phase 7: Utilities

- [x] Create data sanitization utilities

  > Implemented utilities to sanitize sensitive data like passwords, tokens, and credentials.

- [x] Implement log formatting utilities

  > Created formatting utilities for consistent log presentation across environments.

- [x] Add security utilities

  > Added utilities for enhancing security including PII redaction and sensitive field handling.

- [x] Create helper functions
  > Implemented various helper functions for common logging tasks and data manipulation.

### Phase 8: Migration

- [x] Move existing logger code from API package

  > Migrated core logging functionality from the API package to the new logger package.

- [x] Update API package to use new logger

  > Modified the API package to consume the new logger with proper configuration.

- [x] Create migration guide

  > Documented the migration process in the README for future package migrations.

- [x] Update dependencies
  > Updated package dependencies to remove direct Winston and Logtail dependencies from API.

### Phase 9: Testing

- [ ] Set up test environment

  > Not implemented yet.

- [ ] Write unit tests for core functionality

  > Not implemented yet.

- [ ] Write integration tests

  > Not implemented yet.

- [ ] Create test utilities
  > Not implemented yet.

### Phase 10: Documentation

- [x] Write API documentation

  > Added JSDoc comments to all public functions and types for better code understanding.

- [x] Create usage examples

  > Included comprehensive examples in the README for various use cases.

- [x] Document configuration options

  > Documented all configuration options with descriptions and default values.

- [ ] Add security guidelines
  > Not implemented yet.

### Phase 11: Performance Features

- [x] Implement request latency tracking

  > Added request timing to middleware for monitoring performance.

- [x] Add error rate monitoring

  > Implemented error tracking with appropriate log levels and metrics.

- [ ] Create resource utilization tracking

  > Not implemented yet.

- [ ] Add database query monitoring

  > Not implemented yet.

- [x] Implement API latency tracking
  > Added API endpoint performance tracking in the tRPC middleware.

### Phase 12: Log Management

- [ ] Implement log rotation

  > Not implemented yet.

- [ ] Add compression support

  > Not implemented yet.

- [ ] Create retention policies

  > Not implemented yet.

- [ ] Set up archival system

  > Not implemented yet.

- [ ] Implement search optimization
  > Not implemented yet.

### Phase 13: Integration

- [x] Create examples for each package type

  > Added usage examples for API integration in the documentation.

- [ ] Add integration guides

  > Not implemented yet.

- [ ] Create troubleshooting guide

  > Not implemented yet.

- [ ] Document best practices
  > Not implemented yet.

## Success Criteria

1. All packages in the monorepo can use the logger consistently
2. Performance metrics are being collected and are accessible
3. Security measures are in place and validated
4. Log management features are operational
5. Documentation is complete and clear
6. Tests pass with good coverage
7. No degradation in application performance
8. Successful migration of existing logging

## Timeline

- Phase 1-4: Week 1
- Phase 5-8: Week 2
- Phase 9-13: Week 3

## Risks and Mitigation

1. **Risk**: Performance impact from enhanced logging

   - Mitigation: Implement sampling and filtering strategies

2. **Risk**: Security vulnerabilities in log data

   - Mitigation: Regular security audits and thorough testing

3. **Risk**: Storage costs for increased log volume

   - Mitigation: Implement effective retention and archival policies

4. **Risk**: Migration complexity
   - Mitigation: Detailed migration guide and gradual rollout

## Dependencies

- Winston
- Logtail
- Express (for middleware)
- tRPC (for middleware)
- Testing frameworks
- Compression libraries
- Encryption libraries

## Maintenance Plan

1. Regular security updates
2. Performance monitoring
3. Storage usage tracking
4. Regular dependency updates
5. Documentation updates

## Files to Modify

### Package Configuration Files

1. `turbo.json`

   - Add new package to the workspace
   - Configure build dependencies
   - Add logger package to shared dependencies

2. `package.json` (root)
   - Add logger package to workspace packages
   - Update development scripts if needed

### API Package

1. `packages/api/package.json`

   - Remove direct Winston and Logtail dependencies
   - Add @vernisai/logger as a dependency
   - Update scripts if needed

2. `packages/api/src/utils/logger.ts`

   - Will be migrated to new package
   - Current implementation will be refactored and enhanced
   - File will be replaced with import from @vernisai/logger

3. `packages/api/src/utils/request-logger.ts`

   - Migrate middleware implementations to new package
   - Update imports to use new logger package
   - File will be replaced with middleware imports

4. `packages/api/src/middlewares/logger.middleware.ts`

   - Migrate TRPC logging middleware to new package
   - Update imports to use new logger package
   - File will be replaced with middleware imports

5. `packages/api/src/server.ts`
   - Update logger initialization
   - Use new logger package configuration
   - Update middleware setup

### Web Package

1. `packages/web/package.json`

   - Add @vernisai/logger as a dependency

2. `packages/web/src/utils/sentry.ts`
   - Integrate with new logger package for client-side logging
   - Add correlation IDs between Sentry and server logs
   - Enhance error tracking with logger context

### Proxy Package

1. `apps/proxy/package.json`

   - Add @vernisai/logger as a dependency

2. `apps/proxy/src/index.ts`
   - Replace console.log with structured logging
   - Add request/response logging
   - Implement proxy-specific logging context

### Documentation Updates

1. `docs/logs/server-side-logging.md`

   - Update to reflect new package structure
   - Add migration guide
   - Update configuration examples

2. `docs/logs/README.md`
   - Update architecture overview
   - Add new package documentation
   - Update implementation comparison

### Environment Files

1. `.env.example`

   - Add new logger-specific variables
   - Document configuration options

2. Various `.env` files
   - Update logging configuration
   - Add new required variables

## Impact and Benefits

### API Package

- Cleaner code structure
- Removal of direct logging dependencies
- Enhanced logging capabilities
- Better separation of concerns

### Web Package

- Addition of structured client-side logging
- Better error tracking correlation
- Consistent logging patterns with server

### Proxy Package

- Improved debugging capabilities
- Structured logging for proxy operations
- Better operational visibility

### Overall Benefits

- Centralized logging configuration
- Consistent logging across all packages
- Easier maintenance and updates
- Better debugging capabilities
- Enhanced security features
- Improved performance monitoring

## Migration Strategy

### Phase 1: Package Creation

1. Create new package structure
2. Move core logging functionality
3. Enhance with new features
4. Set up initial configuration

### Phase 2: API Package Migration

1. Add new package dependency
2. Update imports gradually
3. Test each component
4. Remove old implementation

### Phase 3: Web Integration

1. Add package dependency
2. Integrate with Sentry
3. Update error handling
4. Add client-side logging

### Phase 4: Proxy Integration

1. Add package dependency
2. Replace console logging
3. Add structured logging
4. Implement proxy context

### Phase 5: Documentation

1. Update all documentation
2. Add migration guides
3. Update configuration examples
4. Add troubleshooting guides
