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

- [ ] Create new package directory structure
- [ ] Set up package.json with dependencies
- [ ] Configure TypeScript (tsconfig.json)
- [ ] Set up build process
- [ ] Create README with documentation

### Phase 2: Core Types

- [ ] Create logger.types.ts
- [ ] Create context.types.ts
- [ ] Create transport.types.ts
- [ ] Create metrics.types.ts

### Phase 3: Core Implementation

- [ ] Implement base logger class
- [ ] Implement async context management
- [ ] Set up Winston configuration
- [ ] Implement metrics tracking system
- [ ] Create log formatters

### Phase 4: Transports

- [ ] Implement Logtail transport
- [ ] Implement console transport
- [ ] Create metrics transport
- [ ] Add transport configuration options

### Phase 5: Security Features

- [ ] Implement PII detection system
- [ ] Add log data encryption
- [ ] Create IP anonymization utility
- [ ] Implement audit logging
- [ ] Add rate limit tracking

### Phase 6: Middleware

- [ ] Create Express middleware
- [ ] Create tRPC middleware
- [ ] Add request tracking
- [ ] Implement performance monitoring

### Phase 7: Utilities

- [ ] Create data sanitization utilities
- [ ] Implement log formatting utilities
- [ ] Add security utilities
- [ ] Create helper functions

### Phase 8: Migration

- [ ] Move existing logger code from API package
- [ ] Update API package to use new logger
- [ ] Create migration guide
- [ ] Update dependencies

### Phase 9: Testing

- [ ] Set up test environment
- [ ] Write unit tests for core functionality
- [ ] Write integration tests
- [ ] Create test utilities

### Phase 10: Documentation

- [ ] Write API documentation
- [ ] Create usage examples
- [ ] Document configuration options
- [ ] Add security guidelines

### Phase 11: Performance Features

- [ ] Implement request latency tracking
- [ ] Add error rate monitoring
- [ ] Create resource utilization tracking
- [ ] Add database query monitoring
- [ ] Implement API latency tracking

### Phase 12: Log Management

- [ ] Implement log rotation
- [ ] Add compression support
- [ ] Create retention policies
- [ ] Set up archival system
- [ ] Implement search optimization

### Phase 13: Integration

- [ ] Create examples for each package type
- [ ] Add integration guides
- [ ] Create troubleshooting guide
- [ ] Document best practices

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
