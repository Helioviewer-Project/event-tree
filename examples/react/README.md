# Helioviewer Event Tree - React Example

This example demonstrates how to use the `@helioviewer/event-tree` component in a React application with Vite.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Navigate to this example directory:
   ```bash
   cd examples/react
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Example

To start the development server:

```bash
npm run dev
```

This will start the Vite development server, typically on `http://localhost:5173`. The page will automatically reload when you make changes to the source code.

### Available Scripts

- `npm run dev` - Start the development server with hot module replacement
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## What's Included

This example includes:

- **EventTreeExample.jsx** - A complete implementation showing how to use the HelioviewerEventTree component
- **Vite configuration** - Modern build tooling with fast refresh
- **ESLint setup** - Code quality and formatting rules

## Using the Component

The example demonstrates:

- Basic component setup with required props
- Event handling for selections and hover states
- State management for selected events
- Integration with React hooks

## Customization

You can modify the example to:

- Change the event source (HEK, CCMC, RHESSI, etc.)
- Customize the date range for events
- Add additional event handling logic
- Style the component to match your application

## Build Tools

This example uses:

- **Vite** - Fast build tool and development server
- **React 19** - Latest React version with modern features
- **ESLint** - Code linting and formatting

## Learn More

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Helioviewer API Documentation](https://api.helioviewer.org/docs/)