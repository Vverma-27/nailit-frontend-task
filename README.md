# Sprint Board - Task Management Application

A modern task management application built with Next.js featuring drag-and-drop functionality, real-time updates, and offline support.

## Features

- **Kanban Board**: Organize tasks across To Do, In Progress, and Done columns
- **Drag & Drop**: Move tasks between columns with smooth animations
- **Task Management**: Create, edit, delete, and prioritize tasks
- **Real-time Updates**: Optimistic updates with React Query
- **Offline Support**: Queue actions when offline and sync when back online
- **Authentication**: Simple login system with persistent sessions
- **Search & Filter**: Find tasks by title and filter by priority
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Toast Notifications**: User feedback for all actions

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand for global state
- **Data Fetching**: React Query (TanStack Query)
- **Drag & Drop**: @dnd-kit
- **Animations**: Framer Motion
- **Backend**: JSON Server (deployed to vercel separately) Link to backend repo: https://github.com/Vverma-27/nailit-json-server

## Setup and Installation

### Prerequisites

- Node.js 18 or higher
- pnpm (recommended) or npm

### Local Development

1. Clone the repository:

```bash
git clone <repository-url>
cd nailit-frontend-task
```

2. Install dependencies & Set up env:

```bash
pnpm install
```

Copy env from .env.example into .env file and set NEXT_PUBLIC_API_URL to the port your json-server is running on. Otherwise if you are not running json-server locally, you can set it to "https://nailit-json-server.vercel.app" where my server is running.

3. Start the development servers:

```bash
pnpm run dev:all
```

This command starts both:

- Next.js development server on http://localhost:3000
- JSON Server API on http://localhost:3001

Alternatively, run them separately:

```bash
# Terminal 1: Start the API server
pnpm run json-server

# Terminal 2: Start the Next.js app
pnpm run dev
```

4. Open http://localhost:3000 in your browser

### Login

Use any email and password combination to access the application. Authentication is simulated for demonstration purposes.

## Available Scripts

- `pnpm dev` - Start Next.js development server
- `pnpm dev:all` - Start both frontend and backend servers
- `pnpm build` - Build the application for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm json-server` - Start JSON Server API

## Project Structure

```
src/
├── api/              # API layer and HTTP clients
├── app/              # Next.js app directory (routes)
├── components/       # React components
│   ├── auth/         # Authentication components
│   ├── board/        # Kanban board components
│   ├── layout/       # Layout components
│   ├── providers/    # Context providers
│   ├── task/         # Task-related components
│   └── ui/           # shadcn/ui components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and services
├── stores/           # Zustand state stores
└── types/            # TypeScript type definitions
```

## Key Features Implementation

- **Offline Queue**: Actions are queued when offline and automatically synced when connection is restored
- **Optimistic Updates**: UI updates immediately for better user experience
- **Drag & Drop**: Implemented with @dnd-kit for smooth interactions
- **Theme Support**: System, light, and dark mode support with next-themes
- **Error Handling**: Comprehensive error boundaries and user feedback

## My Variant: Offline Queue

---

I implemented the offline queue variant (q-z) which queues write operations when the device is offline and replays them when connectivity is restored.

### Implementation Challenges

Initially, I attempted to use `navigator.onLine` for offline detection. However, after researching online, I discovered that this API is unreliable across browsers. In Chrome and Safari, `navigator.onLine` only returns false if the browser cannot connect to a local area network (LAN) or router, not when there's no actual internet connectivity. Firefox has even more limited support for this API.

To solve this, I implemented a more robust offline detection strategy:

- **API Health Checks**: Mock API calls to the JSON Server every 3 seconds to verify actual connectivity
- **Fallback Strategy**: If `navigator.onLine` reports offline, trust it immediately; if online, verify with network requests
- **Request Timeout**: 5-second timeout on health checks to prevent hanging
- **Caching**: Cache results for 5 seconds to avoid excessive network requests

### Features

- **Visual Indicators**: Queued tasks display an orange "Queued" badge
- **Persistent Queue**: Queue survives browser refreshes using localStorage
- **Automatic Sync**: When connectivity is restored, all queued actions are automatically processed
- **Queue Management**: Failed queue items remain for retry, successful ones are removed
- **Error Handling**: Network failures are handled gracefully with user feedback

## Time Spent

**Total Development Time: approx 3-3.5 hours**
