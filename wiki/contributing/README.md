# Contributing Guide

[Previous sections remain the same...]

## Troubleshooting

### 1. Common Issues

#### Build Issues
```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Clear node modules
rm -rf node_modules package-lock.json
npm install
```

#### Development Issues
```bash
# Reset local environment
rm -rf .next node_modules package-lock.json
npm install
npm run dev

# Check TypeScript issues
npm run type-check

# Fix linting issues
npm run lint -- --fix
```

#### Testing Issues
```bash
# Clear Jest cache
npm run test -- --clearCache

# Update snapshots
npm run test -- -u

# Run specific tests
npm run test -- -t "test name"
```

### 2. Environment Issues

#### API Connection
```typescript
// Check API configuration
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);

// Test API connection
fetch(process.env.NEXT_PUBLIC_API_URL + '/health')
  .then(response => response.json())
  .then(data => console.log('API Health:', data));
```

#### Authentication Issues
```typescript
// Check auth configuration
console.log('Auth Config:', {
  keycloakUrl: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID
});
```

## Development Tools

### 1. VS Code Extensions

Required extensions:
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Jest Runner
- GitLens
- Error Lens

```json
// .vscode/extensions.json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-typescript-language",
    "firsttris.vscode-jest-runner",
    "eamodio.gitlens",
    "usernamehw.errorlens"
  ]
}
```

### 2. VS Code Settings

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "javascript.updateImportsOnFileMove.enabled": "always",
  "typescript.updateImportsOnFileMove.enabled": "always"
}
```

### 3. Debug Configuration

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome against localhost",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Jest Current File",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["${fileBasename}", "--config", "jest.config.js"],
      "console": "integratedTerminal",
      "windows": {
        "program": "${workspaceFolder}/node_modules/jest/bin/jest"
      }
    }
  ]
}
```

## Project Maintenance

### 1. Dependency Updates

Regular dependency updates:
```bash
# Check outdated packages
npm outdated

# Update packages
npm update

# Update major versions
npx npm-check-updates -u
npm install
```

Security audits:
```bash
# Run security audit
npm audit

# Fix security issues
npm audit fix
```

### 2. Performance Monitoring

```typescript
// src/lib/performance.ts
export const monitorPerformance = {
  logMetric: (metric: string, value: number) => {
    if (process.env.NODE_ENV === 'production') {
      // Send to monitoring service
      console.log(`[Performance] ${metric}: ${value}`);
    }
  },
  
  trackApiCall: async (name: string, call: Promise<any>) => {
    const start = performance.now();
    try {
      const result = await call;
      const duration = performance.now() - start;
      monitorPerformance.logMetric(`api_call_${name}`, duration);
      return result;
    } catch (error) {
      monitorPerformance.logMetric(`api_error_${name}`, 1);
      throw error;
    }
  }
};
```

### 3. Error Tracking

```typescript
// src/lib/error-tracking.ts
export const errorTracking = {
  captureError: (error: Error, context?: Record<string, any>) => {
    console.error('[Error]', {
      message: error.message,
      stack: error.stack,
      context
    });
    // Send to error tracking service
  },
  
  withErrorBoundary: (Component: React.ComponentType) => {
    return class ErrorBoundary extends React.Component {
      componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        errorTracking.captureError(error, errorInfo);
      }
      
      render() {
        return <Component {...this.props} />;
      }
    };
  }
};
```

## Communication Guidelines

### 1. Issue Reporting

When creating an issue:
- Use issue templates
- Provide clear reproduction steps
- Include relevant logs
- Add appropriate labels
- Link related issues/PRs

### 2. PR Descriptions

Include in PR descriptions:
- Clear description of changes
- Link to related issues
- Screenshots/videos if UI changes
- Breaking changes warning
- Testing instructions
- Deployment considerations

### 3. Documentation Updates

When updating documentation:
- Keep README.md updated
- Update API documentation
- Update component documentation
- Add migration guides
- Update changelog

## Support Resources

### 1. Documentation
- [Project Wiki](../README.md)
- [API Documentation](../api/README.md)
- [Architecture Guide](../architecture/README.md)
- [Testing Guide](../testing/README.md)

### 2. Team Communication
- Discord Channel: `#pharmacyhub-dev`
- Tech Lead: Available in `#tech-support`
- Weekly Dev Meetings: Tuesday 10:00 AM UTC

### 3. Useful Links
- [Project Board](https://github.com/orgs/pharmacyhub/projects/1)
- [CI/CD Pipeline](https://github.com/pharmacyhub/pharmacyhub-frontend/actions)
- [Error Tracking Dashboard](https://sentry.io/pharmacyhub)
- [Performance Monitoring](https://grafana.pharmacyhub.com)