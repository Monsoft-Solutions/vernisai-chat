# VernisAI Chat

VernisAI Chat is an AI-powered chat application and intelligent agent platform developed by Monsoft Solutions.

## Overview

VernisAI Chat provides a powerful chat interface and intelligent agent capabilities to enhance user interactions through advanced AI. The platform enables users to interact with AI models through both simple chat interfaces and complex agent-based workflows. It supports multiple organizations, each with their own set of users, and allows for the creation and management of custom AI agents that can perform specific tasks.

### Key Features

- **AI-Powered Chat**: Real-time conversations with state-of-the-art AI models with streaming responses
- **Intelligent Agents**: Predefined and dynamic agents capable of using tools and solving complex tasks
- **Multi-Organization Support**: Organization-based access control and user management
- **API-First Architecture**: Fully accessible via tRPC endpoints with TypeScript SDK
- **Third-Party Integration**: OpenAPI documentation and SDK for third-party developers
- **Serverless Deployment**: Efficient scaling and cost optimization

## Tech Stack

- **Frontend**: React with TypeScript and Vite
- **API Framework**: tRPC for type-safe APIs
- **Database**: Supabase PostgreSQL with Drizzle ORM
- **Authentication**: Supabase Auth with JWT
- **UI**: Tailwind CSS with Shadcn/UI components
- **AI Integration**: Support for OpenAI, Anthropic, and other LLM providers
- **Monorepo**: Turborepo for efficient development workflow
- **Deployment**: Serverless functions on Vercel or AWS Lambda

## Project Structure

This is a monorepo managed with Turborepo containing the following apps and packages:

### Apps

- `web`: React application with Vite for the main user interface

### Packages

- `@vernisai/ui`: Shared UI component library built on Tailwind and Radix
- `@vernisai/api`: tRPC API implementation and utilities
- `@vernisai/database`: Database schemas and client with Drizzle ORM
- `@vernisai/eslint-config`: Shared ESLint configurations
- `@vernisai/typescript-config`: Shared TypeScript configurations

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v10 or higher)

### Installation

1. Clone the repository

   ```sh
   git clone https://github.com/monsoft-solutions/vernisai-chat.git
   cd vernisai-chat
   ```

2. Install dependencies

   ```sh
   npm install
   ```

3. Set up environment variables

   ```sh
   cp .env.local.example .env.local
   # Update the values in .env.local with your configuration
   ```

   The only required environment variable is `DATABASE_URL`. All other variables have sensible defaults. See [Environment Configuration](docs/core-architecture/04-environment-configuration.md) for details.

4. Start the development server
   ```sh
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start all development servers
- `npm run dev:web` - Start web app development server
- `npm run dev:api` - Start API development server
- `npm run dev:all` - Start both web and API servers concurrently
- `npm run start` - Start all production servers
- `npm run start:web` - Start web app production server
- `npm run start:api` - Start API production server
- `npm run start:all` - Start both web and API production servers concurrently
- `npm run build` - Build for production
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier
- `npm run validate` - Run validation checks including linting, formatting and building
- `npm run clean` - Clean all build artifacts and node_modules

## Documentation

Comprehensive documentation is available in the `docs` directory:

- **Core Architecture**: Technical overview, database schema, and tRPC implementation details
- **UI/UX**: Design system, component specifications, and screen implementations
- **Integration Components**: AI provider integrations, authentication, and third-party services
- **External API**: API documentation for third-party developers

See the [Platform Roadmap](docs/roadmap.md) for a detailed implementation plan.

## Contributing

Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Contact

Monsoft Solutions - [https://monsoftsolutions.com](https://monsoftsolutions.com)
