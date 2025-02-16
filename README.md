# PharmacyHub Frontend

A modern, feature-rich pharmacy management system built with Next.js 15 and Spring Boot.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI
- **State Management**: 
  - Zustand (Client State)
  - TanStack Query (Server State)
- **Authentication**: JWT with Spring Boot
- **API Client**: Axios

## Project Structure

```
/src
├── app/                # Next.js 15 App Router
│   ├── (auth)/         # Authentication routes
│   ├── (dashboard)/    # Protected routes
│   └── api/            # API routes
├── features/           # Feature modules
├── components/         # Shared components
├── hooks/              # Custom hooks
├── lib/                # Utilities
├── providers/          # Context providers
├── services/           # API services
├── store/              # State management
├── styles/             # Global styles
├── types/              # TypeScript types
└── utils/              # Helper functions
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Features

- 🔐 **Authentication**
  - JWT-based auth with Spring Boot
  - Protected routes
  - Persistent sessions
  
- 🎨 **Modern UI**
  - Responsive design
  - Dark mode support
  - Accessible components
  
- 📱 **State Management**
  - Client state with Zustand
  - Server state with TanStack Query
  - Persistent storage
  
- 🚀 **Performance**
  - Server-side rendering
  - Optimized API calls
  - Code splitting

## Development Guidelines

1. **Feature Development**
   - Each feature should be self-contained in the `features/` directory
   - Follow the Feature-Sliced Design methodology
   
2. **State Management**
   - Use Zustand for UI state
   - Use TanStack Query for API data
   
3. **API Integration**
   - All API calls should go through service classes
   - Use the centralized API client
   
4. **Styling**
   - Use Tailwind CSS utility classes
   - Create reusable components with ShadCN UI
   
5. **TypeScript**
   - Maintain strict type safety
   - Share types with backend DTOs

## Contributing

1. Create a new branch for your feature
2. Follow the existing code style
3. Write clear commit messages
4. Submit a pull request

## License

MIT
