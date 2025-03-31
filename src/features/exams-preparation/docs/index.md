# Exam Preparation Documentation

This directory contains comprehensive documentation for the Exam Preparation feature.

## Component Design and Architecture

- [Component Design Guide](./COMPONENT_DESIGN.md) - Detailed documentation on component design principles, core UI integration, and component extension patterns
- [Core UI Examples](./CORE_UI_EXAMPLES.md) - Real-world examples of integrating with core UI components

## Feature Overview

- [Feature README](../README.md) - High-level overview of the Exam Preparation feature, its architecture, and structure
- [Components README](../components/README.md) - Documentation specific to the components directory

## Migration Information

- [Migration Guide](../MIGRATION.md) - Information about migrating from the deprecated exams feature

## Other Documentation

- [Import Update Plan](../import-update-plan.md) - Plan for updating import statements
- [Import Update Report](../import-update-report.md) - Report on import statement updates

## How to Contribute

When contributing to this feature, please follow these guidelines:

1. **Core as Foundation**: Always leverage core components rather than creating custom implementations
2. **Atomic Design**: Follow atomic design principles for all components
3. **Size Limitations**: Keep components under 200 lines of code
4. **Single Responsibility**: Each component should have a clear, focused purpose
5. **Documentation**: Update relevant documentation when making changes

## Best Practices

### Component Structure

Components should be organized by atomic design categories:
- `atoms` - The smallest building blocks
- `molecules` - Simple combinations of atoms
- `organisms` - Complex UI sections
- `templates` - Page layouts and containers

### Extending Core UI

When extending core UI components:
1. Use composition over inheritance
2. Forward props to maintain the core component API
3. Only add feature-specific functionality
4. Document any extensions with clear examples

### Testing Components

When testing components:
1. Test component responsibilities
2. Mock dependencies appropriately
3. Use core testing utilities
4. Cover edge cases and variations

## Additional Resources

For more information about the overall frontend architecture:
- [Frontend Refactoring Plan](https://seroft-solutions.atlassian.net/wiki/spaces/PHAR/pages/56066107)
