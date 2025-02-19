# PharmacyHub Documentation

Welcome to the comprehensive documentation for PharmacyHub. This documentation provides detailed information about the project architecture, features, authentication system, development guidelines, and more.

## Documentation Structure

### 1. [Overview](./01-overview/README.md)
- Project introduction
- System requirements
- Tech stack summary
- Quick start guide

### 2. [Architecture](./02-architecture/README.md)
- System architecture
- Application layers
- Code organization
- Design patterns
- Performance considerations

### 3. [Authentication & Authorization](./03-authentication/README.md)
- Keycloak integration
- Permission system
- Role-based access control
- Authentication flows
- Security guidelines

### 4. [Features](./04-features/README.md)
- Licensing management
- Exam preparation
- User management
- Pharmacy operations
- Inventory management
- Reporting

### 5. [Development Guide](./05-development/README.md)
- Development environment setup
- Coding standards
- Testing guidelines
- State management
- Component patterns
- API integration

### 6. [Deployment](./06-deployment/README.md)
- Environment configuration
- Deployment process
- CI/CD pipeline
- Monitoring and logging
- Performance optimization

## Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/pharmacyhub-frontend.git

# Navigate to the project directory
cd pharmacyhub-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start the development server
npm run dev
```

## Key Technologies

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **State Management**: Zustand, React Query
- **UI Components**: ShadCN UI
- **Authentication**: Keycloak 25.0.2
- **Backend**: Spring Boot (Java)
- **Testing**: Jest, React Testing Library, Playwright
- **Deployment**: Docker, Kubernetes

## Contributing

Please read our [Contributing Guide](./05-development/contributing.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
