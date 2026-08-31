<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Nestora - AI-Powered Property Management Platform

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/c144bf1a-a51a-454a-b108-e8e7ddf8c7d5

## What is Nestora?

Nestora is a modern, AI-powered property management and rental platform built with React and TypeScript. It provides a comprehensive solution for both property seekers and hosts to discover, compare, book, and manage properties. The platform features immersive 3D virtual tours, interactive mapping, advanced filtering, and intelligent property recommendations powered by Google's Gemini AI.

### Key Features:

- **Virtual Tours** - Explore properties with immersive 3D panoramic views and interactive hotspots
- **Property Search & Filtering** - Advanced search with price histograms, location-based filters, and interactive maps
- **Property Comparison** - Compare multiple properties side-by-side with detailed analytics
- **Booking System** - Seamless booking requests and management for both guests and hosts
- **Host Dashboard** - Comprehensive property management, analytics, and listing wizard
- **Neighborhood Guide** - AI-powered insights about neighborhoods and communities
- **Multi-language Support** - Built-in internationalization for global accessibility
- **PDF Generation** - Download property details and agreements as PDFs

## How to Use

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Gemini API key (optional, for AI features)

### Installation & Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure Environment:**
   - Copy `.env.local.example` to `.env.local` (if available)
   - Set your `GEMINI_API_KEY` in [.env.local](.env.local) for AI features

3. **Run the development server:**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

4. **Build for production:**

   ```bash
   npm run build
   ```

5. **Preview the production build:**
   ```bash
   npm run preview
   ```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Create optimized production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Check TypeScript compilation
- `npm run clean` - Remove build artifacts

## How It Works

### Architecture

Nestora is built on a modern, scalable architecture with clear separation of concerns:

**Frontend Stack:**

- **React 19** - UI library with latest features and performance optimizations
- **TypeScript** - Type-safe development with better IDE support
- **Vite** - Ultra-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development

**Key Technologies:**

- **Three.js** - 3D rendering for immersive virtual tours
- **Leaflet** - Interactive mapping and location services
- **Zustand** - Lightweight state management for app state
- **Motion** - Animation library for smooth transitions
- **jsPDF** - PDF generation for documents and agreements
- **Canvas Confetti** - Celebratory animations for bookings

### Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── layout/       # App shell, navbar, footer
│   ├── shared/       # Shared components (property cards, 3D preview)
│   └── virtualTour/  # Virtual tour related components
├── features/         # Feature modules
│   ├── home/         # Homepage sections
│   ├── host/         # Host dashboard & listing wizard
│   ├── property/     # Property details & modals
│   └── search/       # Search, filtering, maps
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and libraries
├── stores/           # Zustand state management
├── pages/            # Page components (route targets)
├── data/             # Mock data and fixtures
└── locales/          # i18n translations
```

### Data Flow

1. **User Interaction** - Users interact with UI components
2. **State Management** - Zustand stores handle app state (bookings, comparisons, search filters, etc.)
3. **API & Data** - Components fetch data from mock data or external APIs
4. **Rendering** - React components render based on state changes
5. **Effects** - Custom hooks handle side effects (maps, tours, animations)

### Key Features Implementation

- **Virtual Tours** - Uses Three.js and Canvas for interactive 3D panoramas with hotspot interactions
- **Maps** - Leaflet integration for displaying properties on interactive maps
- **PDF Generation** - jsPDF library for creating downloadable property documents
- **State Persistence** - Zustand stores manage bookings, wishlists, and comparisons across sessions
- **Internationalization** - Multi-language support via translation files in `locales/`
- **Responsive Design** - Tailwind CSS with mobile-first approach for all screen sizes
