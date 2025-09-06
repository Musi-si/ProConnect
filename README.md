# ProConnect - Micro Freelance Marketplace

## Overview

ProConnect is a comprehensive micro freelance marketplace platform that connects clients with freelancers for project-based work. The platform facilitates task posting, bidding, milestone tracking, payments, and communication between parties. Built as a full-stack web application, it features role-based dashboards for clients, freelancers, and administrators, with integrated payment processing, real-time messaging, and comprehensive project management capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Library**: shadcn/ui components built on Radix UI primitives for accessibility and customization
- **Styling**: Tailwind CSS with custom design system including dark mode support
- **Forms**: React Hook Form with Zod validation for type-safe form handling

### Backend Architecture  
- **Runtime**: Node.js with Express.js framework for REST API endpoints
- **Language**: TypeScript throughout for consistency and type safety
- **API Design**: RESTful API with standardized endpoints for resources (users, projects, proposals, messages)
- **Real-time Communication**: WebSocket server for instant messaging and live notifications
- **Authentication**: JWT-based authentication with refresh token support
- **File Handling**: Integrated file upload/download capabilities for project attachments

### Database Design
- **Database**: PostgreSQL as primary data store
- **ORM**: Drizzle ORM for type-safe database operations and schema management  
- **Schema**: Comprehensive relational design with tables for users, projects, proposals, milestones, messages, notifications, and reviews
- **Migrations**: Drizzle Kit for database schema versioning and migrations
- **Connection**: Neon serverless PostgreSQL for scalable cloud database hosting

### Authentication & Authorization
- **Strategy**: JWT tokens stored in localStorage for session persistence
- **Password Security**: bcrypt hashing with configurable salt rounds
- **Role-Based Access**: Three-tier role system (freelancer, client, admin) with route-level protection
- **Email Verification**: OTP-based email verification system for account activation
- **Password Reset**: Secure token-based password reset functionality

### Payment Integration
- **Payment Processor**: Stripe integration for secure payment handling
- **Payment Methods**: Support for multiple payment methods (cards, bank transfers, digital wallets)
- **Milestone Payments**: Escrow-style milestone-based payment system
- **Financial Tracking**: Comprehensive earnings and spending analytics for users

### Real-time Features  
- **Messaging**: WebSocket-based real-time chat system for project communication
- **Notifications**: Live notification system with email integration for critical events
- **Status Updates**: Real-time project and proposal status changes
- **File Sharing**: In-chat file attachment and sharing capabilities

### UI/UX Design Principles
- **Design System**: Custom theme built on neutral color palette with orange primary accent
- **Responsive Design**: Mobile-first approach with adaptive layouts for all screen sizes
- **Accessibility**: ARIA-compliant components using Radix UI primitives
- **Dark Mode**: System preference detection with manual toggle support
- **Component Library**: Modular, reusable components following atomic design principles

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database driver for Neon
- **drizzle-orm**: Type-safe ORM for database operations
- **express**: Web application framework for Node.js
- **jsonwebtoken**: JWT token generation and verification
- **bcrypt**: Password hashing and verification
- **ws**: WebSocket server implementation

### Frontend Libraries
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight React router
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Runtime type validation and schema parsing
- **date-fns**: Date manipulation and formatting utilities
- **clsx & tailwind-merge**: Conditional CSS class management

### UI Components
- **@radix-ui/***: Accessible, unstyled UI primitives for building design system
- **class-variance-authority**: Type-safe variant API for component styling
- **cmdk**: Command palette and search interface
- **lucide-react**: Modern icon library

### Payment Processing
- **@stripe/stripe-js**: Stripe JavaScript SDK
- **@stripe/react-stripe-js**: React components for Stripe integration

### Development Tools
- **typescript**: Static type checking throughout the application
- **vite**: Fast build tool and development server
- **tailwindcss**: Utility-first CSS framework
- **postcss**: CSS transformation and optimization
- **eslint & prettier**: Code formatting and linting (implied from shadcn/ui setup)

### Session Management
- **connect-pg-simple**: PostgreSQL session store for Express sessions (if session-based auth is implemented alongside JWT)

### Cloud Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Stripe**: Payment processing and financial transactions
- **Email Service**: SMTP service for transactional emails (OTP, notifications)