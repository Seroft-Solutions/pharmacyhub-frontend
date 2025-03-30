# Core API Module Documentation

This directory contains comprehensive documentation for the Core API module of the PharmacyHub Frontend application.

## Overview

The Core API module provides a standardized, consistent approach to API integration that follows our architecture principles, particularly the "Core as Foundation" principle. It serves as the foundation for all data fetching and mutations across the application.

## Documentation

### Core API Integration Guide

The [Core API Integration Guide](core-api-integration-guide.md) provides a comprehensive overview of the Core API module and how to properly leverage it in feature implementations. It covers:

- Introduction to the Core API module
- Core API module structure
- Integration patterns
- Feature-specific integration
- Extending core functionality
- Troubleshooting
- Reference information

### Core API Troubleshooting Guide

The [Core API Troubleshooting Guide](core-api-troubleshooting.md) provides solutions for common issues encountered when working with the Core API module. It covers:

- Network and request issues
- Query and cache issues
- Mutation issues
- TypeScript and type issues
- Performance issues
- Common error scenarios
- Debugging tools and techniques

## Feature-Specific Guides

Each feature that leverages the Core API module should include its own integration guide in its directory. For example:

- [Exams Preparation Core API Integration Guide](../../../src/features/exams-preparation/api/CORE-INTEGRATION.md)

## Principles

The Core API module and all feature implementations should follow these key principles:

1. **Use core, don't duplicate**: Leverage core API utilities instead of reimplementing functionality
2. **Clean public API**: Export a well-defined, easy-to-use API for feature components
3. **Proper typing**: Provide TypeScript interfaces for type safety
4. **Consistent patterns**: Follow established patterns for query keys, error handling, etc.

## Contributing

When contributing to the Core API module or feature-specific implementations:

1. Follow the established patterns and principles
2. Ensure proper TypeScript typing
3. Add comprehensive tests
4. Update or extend the documentation
5. Submit a pull request for review

For questions or issues, please contact the architecture team.
