# Sprint Board - Task Management Application

A modern, responsive task management application built with Next.js, featuring drag-and-drop functionality and real-time updates.

## Features

- 🎯 **Kanban Board**: Organize tasks in To Do, In Progress, and Done columns
- 🖱️ **Drag & Drop**: Move tasks between columns with smooth animations
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🎨 **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- 🔐 **Authentication**: Simple login system with persistent sessions
- 🚀 **Real-time Updates**: Powered by React Query for optimistic updates
- 📊 **Task Management**: Create, update, and delete tasks with priorities
- 🌙 **Theme Support**: Light and dark mode ready

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **State Management**: Zustand, React Query
- **Drag & Drop**: @dnd-kit
- **Animations**: Framer Motion
- **Backend**: JSON Server (mock API)
- **Icons**: Lucide React
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nailit-frontend-assignment
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development servers:
```bash
pnpm run dev:all
```

This will start both:
- Next.js development server on `http://localhost:3000`
- JSON Server API on `http://localhost:3001`

Alternatively, you can run them separately:
```bash
# Terminal 1: Start the API server
pnpm run json-server

# Terminal 2: Start the Next.js app
pnpm run dev
```

### Login

Use any email/password combination to login. The authentication is simulated for demo purposes.

## Project Structure

```
src/
├── api/           # API layer and data fetching
├── app/           # Next.js app directory (pages)
├── components/    # Reusable React components
│   ├── board/     # Board-specific components
│   ├── layout/    # Layout components (header, etc.)
│   ├── providers/ # Context providers
│   ├── task/      # Task-related components
│   └── ui/        # shadcn/ui components
├── stores/        # Zustand state stores
├── types/         # TypeScript type definitions
└── lib/           # Utility functions
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm dev:all` - Start both frontend and backend
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm json-server` - Start mock API server

## Development Highlights

This project demonstrates:

- Modern React patterns with hooks and context
- TypeScript for type safety
- Component composition and reusability
- Responsive design principles
- State management with multiple stores
- API integration with React Query
- Drag and drop implementation
- Modern build tools and development workflow

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is for educational purposes as part of a coding assignment.