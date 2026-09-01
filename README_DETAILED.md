# Nestora - Premium Property Rental Platform for Dhaka

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Zustand](https://img.shields.io/badge/Zustand-5.0-brown)](https://github.com/pmndrs/zustand)

## 📋 Overview

**Nestora** is a modern, full-featured property rental platform designed specifically for the Dhaka real estate market. It provides an intuitive interface for both renters seeking properties and landlords/hosts managing listings. The platform combines stunning 3D visualizations, interactive maps, and intelligent search capabilities to revolutionize how properties are discovered and leased in Dhaka.


---

## 🏗️ Architecture Overview

### Tech Stack

| Category               | Technology                        |
| ---------------------- | --------------------------------- |
| **Frontend Framework** | React 19 with TypeScript          |
| **Build Tool**         | Vite 6.2                          |
| **Styling**            | Tailwind CSS 4.1 + Tailwind Merge |
| **State Management**   | Zustand 5.0                       |
| **3D Graphics**        | Three.js                          |
| **Maps**               | Leaflet + React Leaflet           |
| **Animation**          | Motion (Framer Motion)            |
| **PDF Export**         | jsPDF                             |
| **Icons**              | Lucide React                      |
| **Date Handling**      | date-fns                          |
| **AI Integration**     | Google GenAI                      |
| **Backend**            | Express.js (Node.js)              |
| **Dev Environment**    | Node.js with npm                  |

### Project Structure

```
nestora/
├── src/
│   ├── components/              # Reusable React components
│   │   ├── layout/              # Layout components (AppShell, Navbar, Footer)
│   │   ├── shared/              # Shared components (PropertyCard, ThreeDRoomPreview, FloatingDock)
│   │   └── virtualTour/         # Virtual tour components (PanoramaCanvas, HotspotModal, etc.)
│   │
│   ├── features/                # Feature-specific components
│   │   ├── home/                # Homepage sections (hero, how-it-works, featured hosts)
│   │   ├── host/                # Host dashboard features (listings, booking requests, stats)
│   │   ├── property/            # Property-specific features (booking, messaging, gallery)
│   │   └── search/              # Search interface (filters, map integration, sliders)
│   │
│   ├── pages/                   # Page components (route destinations)
│   │   ├── HomePage.tsx         # Landing page with hero and featured properties
│   │   ├── SearchPage.tsx       # Advanced property search and filtering
│   │   ├── PropertyDetailsPage.tsx
│   │   ├── HostDashboardPage.tsx
│   │   ├── SavedWishlistPage.tsx
│   │   ├── PropertyComparisonPage.tsx
│   │   ├── NeighborhoodGuidePage.tsx
│   │   └── TenancyAgreementPage.tsx
│   │
│   ├── stores/                  # Zustand state management
│   │   ├── useNavigationStore.ts    # App routing and history
│   │   ├── useSearchStore.ts        # Search filters and location
│   │   ├── useBookingStore.ts       # Booking management
│   │   ├── useCompareStore.ts       # Property comparison state
│   │   ├── useHostStore.ts          # Host/landlord data
│   │   ├── useWishlistStore.ts      # Saved properties
│   │   ├── useMapStore.ts           # Map interactions
│   │   └── useLanguageStore.ts      # i18n and translations
│   │
│   ├── data/                    # Static data and mock data
│   │   ├── mockData.ts          # Mock properties and hosts
│   │   └── virtualTourData.ts   # Virtual tour configurations
│   │
│   ├── hooks/                   # Custom React hooks
│   │   └── useDeviceGyroscope.ts    # Device gyroscope support for mobile VR
│   │
│   ├── lib/                     # Utility libraries and helpers
│   │   ├── utils.ts             # General utilities
│   │   ├── ambientSound.ts       # Audio playback utilities
│   │   └── propertyPdfGenerator.ts  # PDF generation logic
│   │
│   ├── locales/                 # i18n translations
│   │   └── translations.ts      # English & Bengali translations
│   │
│   ├── types.ts                 # TypeScript type definitions
│   ├── App.tsx                  # Root component with routing
│   ├── main.tsx                 # React DOM entry point
│   └── index.css                # Global styles
│
├── assets/                      # Static assets (images, fonts, etc.)
├── index.html                   # HTML entry point
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── package.json                # Project dependencies
└── README.md                   # Basic README
```

---

## 🔄 How It Works - Core Flows

### 1. **Navigation & Routing System**

Nestora uses a **custom client-side routing** pattern managed by `useNavigationStore`:

```
┌─────────────────────────────────────────────────┐
│            Navigation Store (Zustand)            │
│  - Manages currentRoute & browser history        │
│  - Implements smooth scroll behavior             │
├─────────────────────────────────────────────────┤
│  Routes:                                         │
│  • home - Landing page with featured listings   │
│  • search - Advanced property search & filters  │
│  • property - Individual property details       │
│  • host-dashboard - Host management portal      │
│  • wishlist - Saved properties                  │
│  • compare - Side-by-side property comparison   │
│  • neighborhoods - Area guides & insights       │
│  • agreement - Tenancy agreement generation     │
└─────────────────────────────────────────────────┘
```

**Key Characteristics:**

- No external routing library (no React Router)
- Simple, lightweight state-based routing
- Back button support with history tracking
- Automatic smooth scroll-to-top on navigation

### 2. **State Management Architecture**

Nestora uses **Zustand** for predictable, lightweight state management:

#### Core Stores:

**useNavigationStore** - App routing and navigation history

```typescript
- currentRoute: Tracks active page
- history: Browser back button support
- navigate(): Change current page
- goBack(): Return to previous page
```

**useSearchStore** - Search filters and location context

```typescript
- location: Selected search location
- filters: Price range, bedrooms, amenities, furnished status
- sortBy: Sorting preference
- setLocation(), setFilters(), setSortBy()
```

**useBookingStore** - Booking workflow state

```typescript
- bookings: User's booking history
- selectedProperty: Current booking target
- bookingDetails: Guest details, dates, messages
- createBooking(), updateBooking()
```

**useCompareStore** - Property comparison feature

```typescript
- compareList: Array of property IDs to compare
- addToCompare(), removeFromCompare(), clearCompare()
```

**useWishlistStore** - Saved/favorite properties

```typescript
- wishlistIds: Array of saved property IDs
- addToWishlist(), removeFromWishlist(), isWishlisted()
```

**useHostStore** - Landlord portal data

```typescript
- hostProperties: Listings managed by host
- bookingRequests: Incoming rental inquiries
- analytics: Occupancy, views, inquiries
- updateProperty(), respondToBooking()
```

**useMapStore** - Interactive map interactions

```typescript
- selectedProperty: Highlighted property on map
- visibleBounds: Currently visible map area
- setSelectedProperty(), setBounds()
```

**useLanguageStore** - Internationalization

```typescript
- currentLanguage: 'en' or 'bn'
- t(): Translation function
- formatNumber(): Locale-aware number formatting
```

### 3. **Component Hierarchy & Data Flow**

```
App.tsx (Route Selection)
│
├── AppShell
│   ├── Navbar (Navigation + Language Switcher)
│   ├── main (Current Route Component)
│   │   ├── HomePage
│   │   │   ├── HeroSearchBar
│   │   │   ├── PropertyCard[] (Featured)
│   │   │   ├── PropertyCard[] (Recommended)
│   │   │   └── HomeSections (How-it-works, Why Nestora, etc.)
│   │   │
│   │   ├── SearchPage
│   │   │   ├── FilterDrawer
│   │   │   ├── InteractiveLeafletMap
│   │   │   └── PropertyCard[] (Filtered Results)
│   │   │
│   │   ├── PropertyDetailsPage
│   │   │   ├── PropertyCard (Header)
│   │   │   ├── VirtualTourViewer
│   │   │   ├── PhotoGalleryModal
│   │   │   ├── ReviewsSection
│   │   │   ├── HostCard
│   │   │   └── BookingModal
│   │   │
│   │   ├── HostDashboardPage
│   │   │   ├── HostStats
│   │   │   ├── BookingRequestsList
│   │   │   ├── PropertyManagementTable
│   │   │   └── ListingWizard
│   │   │
│   │   ├── PropertyComparisonPage
│   │   ├── SavedWishlistPage
│   │   ├── NeighborhoodGuidePage
│   │   └── TenancyAgreementPage
│   │
│   ├── FloatingCompareDock (Persistent UI)
│   └── Footer
```

### 4. **Data Flow: Search & Filtering**

```
User Input (Search Page)
│
├─ HeroSearchBar / FilterDrawer
│  └─> Updates useSearchStore
│      ├─ location
│      ├─ priceRange
│      ├─ bedrooms, bathrooms
│      ├─ amenities[]
│      ├─ propertyType
│      └─ furnished
│
├─ SearchPage Component
│  └─> Reads from useSearchStore
│      └─> Filters mockData.properties
│          └─> Renders PropertyCard[]
│
└─ InteractiveLeafletMap
   └─> Reads filtered properties
       └─> Renders markers on map
           └─> Updates useMapStore on selection
```

### 5. **Property Details & Virtual Tours**

```
PropertyDetailsPage
│
├── VirtualTourViewer (if virtualTourData exists)
│   └── PanoramaCanvas
│       ├─ Renders panoramic image with Three.js
│       ├─ TourNavigationOverlay (navigation arrows)
│       ├─ TourMinimap (floor plan with hotspots)
│       └─ TourHotspots
│           └─ HotspotDetailsModal (on click)
│
├── PhotoGalleryModal (property images carousel)
│
├── ReviewsSection (guest reviews with ratings)
│
├── HostCard (landlord/host information)
│   ├─ Ratings and response rate
│   ├─ Contact information
│   └─ DirectMessageModal
│
└── BookingModal (rental inquiry form)
    ├─ Date selection
    ├─ Guest details
    ├─ Message to host
    └─ Submit booking request
```

### 6. **Host Dashboard Flow**

```
HostDashboardPage
│
├── HostStats
│   ├─ Total Properties
│   ├─ Total Bookings
│   ├─ Response Rate
│   └─ Occupancy Rate
│
├── BookingRequestsList
│   ├─ Filter by status (Pending, Accepted, Declined)
│   └─ Actions (Accept, Decline, Message)
│
├── PropertyManagementTable
│   ├─ Edit Property
│   ├─ View Analytics
│   └─ Delete Property
│
└── ListingWizard
    ├─ Basic Info (title, description, location)
    ├─ Property Details (bedrooms, bathrooms, size)
    ├─ Amenities Selection
    ├─ Photo Upload
    ├─ Pricing & Availability
    └─ Virtual Tour Setup
```

### 7. **Comparison Feature Flow**

```
PropertyCard (Any page)
│
└─> Add to Compare Button
    └─> Updates useCompareStore
        └─> FloatingCompareDock shows count
            └─> User clicks to navigate
                └─> PropertyComparisonPage
                    └─> Renders side-by-side comparison table
                        ├─ Price, bedrooms, amenities
                        ├─ Ratings and reviews
                        └─ Quick booking buttons
```

### 8. **Wishlist/Saved Properties Flow**

```
PropertyCard
│
└─> Heart Icon (Save button)
    └─> Updates useWishlistStore
        └─> Persisted in state
            └─> SavedWishlistPage
                └─> Displays all saved properties
                    ├─ Filter by area/price
                    └─ Quick actions (compare, book)
```

---

## 🎯 Key Features in Detail

### Virtual Tours (3D/360°)

The platform features immersive 360° panoramic room views:

- **PanoramaCanvas**: Three.js-based panoramic image rendering
- **Interactive Hotspots**: Click to view room details, navigate between rooms, or see feature information
- **HotspotTypes**:
  - `navigation` - Links to other rooms in the property
  - `feature` - Highlights amenities or specific features
  - `utility` - Shows utility locations (power outlets, HVAC, etc.)
  - `dimension` - Displays room measurements
- **Minimap**: Floor plan with hotspot overlay for spatial awareness
- **Gyroscope Support**: Mobile VR experience with device orientation (via `useDeviceGyroscope`)

**Virtual Tour Data Structure:**

```typescript
virtualTour: {
  id: string;
  title: string;
  description: string;
  rooms: {
    id: string;
    name: string;
    panoramaUrl: string;
    hotspots: TourHotspot[];
  }[];
}
```

### Advanced Search & Filtering

- **Location-based search** with autocomplete
- **Price range slider** with histogram visualization (`PriceHistogramSlider`)
- **Multi-select filters**: Amenities, property type, furnished status
- **Map integration**: View properties geographically with Leaflet
- **Real-time filtering** with instant results update

### Property Comparison

- **Add multiple properties** to comparison cart (persisted in store)
- **Floating dock** shows comparison count and quick access
- **Detailed comparison table** with all property metrics
- **Highlight differences** between selected properties
- **Quick booking** from comparison view

### Host Dashboard

Complete management portal for landlords:

- **Booking requests** management with accept/decline/message
- **Property analytics** - views, inquiries, occupancy rate
- **Listing wizard** - step-by-step property creation with preview
- **Direct messaging** with potential tenants
- **Property editing** and management

### Multi-Language Support

- **English (en)** and **Bengali (bn)** full support
- **Language switcher** in navbar
- **Locale-aware formatting**: Numbers, dates, currency
- **Accessible via useLanguageStore**

### PDF Generation

- **Property details PDF**: Download full property information
- **Tenancy agreement PDF**: AI-generated lease agreements with customizable terms

### Mobile-First Responsive Design

- **Desktop**: Full feature set with sidebar navigation
- **Tablet**: Optimized layout with collapsible filters
- **Mobile**: Bottom navigation bar, full-screen modals, touch-optimized

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- **Gemini API Key** (for AI features like lease generation)

### Installation

1. **Clone and navigate to project:**

   ```bash
   cd nestora
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create `.env.local` in the project root:

   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

### Available Scripts

| Command           | Description                           |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Start development server (hot reload) |
| `npm run build`   | Build for production                  |
| `npm run preview` | Preview production build locally      |
| `npm run lint`    | Run TypeScript type checking          |
| `npm run clean`   | Remove build artifacts                |

---

## 🎨 Styling & Design System

### Color Palette

- **Primary Accent**: `#c9996b` (Warm tan/beige)
- **Secondary Accent**: `#5c766d` (Muted sage green)
- **Background**: `#ede9e6` (Off-white/cream)
- **Text Primary**: `#3f3531` (Dark brown)
- **Text Secondary**: `#5c4f4a` (Medium brown)

### Design Approach

- **Tailwind CSS** for utility-first styling
- **Motion** (Framer Motion) for smooth animations
- **Lucide React** for consistent iconography
- **Responsive breakpoints**: Mobile-first approach
- **Glassmorphism effects**: Subtle backdrop blur for modals and overlays

### Typography

- **Display**: Outfit (geometric, modern)
- **Body**: System font stack for performance
- **Font weights**: Regular (400), Bold (700), Extrabold (800)

---

## 🔌 API Integration Points

### Google Gemini API

- **Used for**: AI-powered tenancy agreement generation
- **Environment Variable**: `VITE_GEMINI_API_KEY`
- **Implementation**: See `propertyPdfGenerator.ts`

### Mock Data

Currently using mock data in `data/mockData.ts`:

- Mock properties with full details
- Mock hosts/landlords
- Mock booking requests
- Mock reviews

**To integrate real API:**

1. Replace mock data fetches with actual API calls
2. Update store actions to call backend endpoints
3. Implement error handling and loading states

---

## 📱 Component Library Reference

### Layout Components

- **AppShell**: Main layout wrapper
- **Navbar**: Top navigation with brand and menu
- **Footer**: Footer information and links
- **LanguageSwitcher**: i18n language selection

### Shared Components

- **PropertyCard**: Displays property preview with key info
- **FloatingCompareDock**: Sticky comparison cart
- **ThreeDRoomPreview**: 3D room visualization
- **HotspotDetailsModal**: Virtual tour hotspot details

### Feature Components

- **HeroSearchBar**: Homepage search with location and quick filters
- **FilterDrawer**: Advanced filtering interface
- **InteractiveLeafletMap**: Map-based property browsing
- **PriceHistogramSlider**: Price range selection with distribution
- **BookingModal**: Rental inquiry form
- **PropertyManagementTable**: Admin table for host listings
- **HostStats**: Dashboard metrics and KPIs

### Virtual Tour Components

- **VirtualTourViewer**: Main virtual tour container
- **PanoramaCanvas**: Panoramic image renderer
- **TourNavigationOverlay**: Navigation controls
- **TourMinimap**: Spatial floor plan with hotspots
- **TourHotspot**: Interactive hotspot marker

---

## 🔐 Type Safety

All data is fully typed with TypeScript:

### Core Types

```typescript
// Property listing
type PropertyType = 'Apartment' | 'Penthouse' | 'Villa' | ... ;
interface Property { ... }

// User/Host
interface Host { ... }
interface Review { ... }

// Booking & Agreement
interface Booking { ... }
interface TenancyAgreement { ... }

// Virtual Tour
type HotspotType = 'navigation' | 'feature' | 'utility' | 'dimension';
interface TourHotspot { ... }
interface VirtualTourData { ... }

// Routing
interface PageRoute { name: string; propertyId?: string; ... }
```

---

## 🐛 Common Development Tasks

### Adding a New Feature

1. **Create page component** in `src/pages/`
2. **Add route type** to `useNavigationStore`
3. **Create feature store** (if needed) in `src/stores/`
4. **Build sub-components** in `src/features/` or `src/components/`
5. **Add translations** to `src/locales/translations.ts`
6. **Test navigation** and state flow

### Modifying Property Data

**Mock data location**: `src/data/mockData.ts`

To add properties:

```typescript
// Add to mockProperties array
{
  id: 'prop-xx',
  title: 'Luxury Apartment in Gulshan',
  location: 'Gulshan-2, Dhaka',
  // ... other fields
}
```

### Adding Translations

**Edit**: `src/locales/translations.ts`

```typescript
export const translations = {
  // Add new key
  my_feature_key: {
    en: 'English text',
    bn: 'Bengali text',
  },
  // Use in component
  const { t } = useLanguageStore();
  <p>{t('my_feature_key')}</p>
};
```

### Creating Virtual Tours

1. Prepare panoramic images (equirectangular format, 4K+ recommended)
2. Create tour data in `data/virtualTourData.ts`:

```typescript
{
  id: 'tour-1',
  title: 'Living Room Tour',
  description: 'Full 360° view of living area',
  rooms: [
    {
      id: 'living-room',
      name: 'Living Room',
      panoramaUrl: 'https://...',
      hotspots: [
        {
          id: 'hs-1',
          yaw: 45,
          pitch: 0,
          title: 'Feature Name',
          type: 'feature',
          description: 'Feature details'
        }
      ]
    }
  ]
}
```

3. Link to property via `virtualTour` field

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

Output goes to `dist/` directory. Files are optimized and minified.

### Environment Variables for Production

Create `.env.local`:

```
VITE_GEMINI_API_KEY=your_production_key
VITE_API_URL=https://your-api.com  # If using backend API
```

### Hosting Options

- **Vercel**: Optimized for Vite apps
- **Netlify**: Simple drag-and-drop deployment
- **AWS Amplify**: Full-stack hosting with backend
- **GitHub Pages**: Static hosting (requires hash routing)

---

## 📊 Performance Optimizations

### Already Implemented

- **Code splitting** via Vite
- **Tree-shaking** of unused code
- **Image lazy loading** in galleries
- **Zustand** for minimal re-renders
- **Memoization** of components using `motion.div`
- **CSS-in-JS via Tailwind** with PurgeCSS

### Recommendations

- Implement **image optimization** (next-gen formats, responsive)
- Add **route-level code splitting**
- Use **React.lazy()** for heavy components
- Implement **request caching** strategies
- Monitor **Core Web Vitals** with Lighthouse

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

---

## 📄 License

Apache License 2.0 - See LICENSE file for details

---

## 🆘 Troubleshooting

### Common Issues

| Issue                        | Solution                                                                         |
| ---------------------------- | -------------------------------------------------------------------------------- |
| Port 3000 already in use     | Change port: `npm run dev -- --port 3001`                                        |
| TypeScript errors            | Run `npm run lint` to see all errors, fix types in `src/types.ts`                |
| Tailwind classes not working | Ensure file is included in `tailwind.config.ts` content array                    |
| Virtual tours not loading    | Check panorama image URLs are accessible and CORS-enabled                        |
| Google Gemini API errors     | Verify API key in `.env.local` and check quota/permissions                       |
| Navigation store reset       | Page refresh clears history by design - consider adding localStorage persistence |

---

## 📚 Useful Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Zustand Store](https://github.com/pmndrs/zustand)
- [Three.js Documentation](https://threejs.org)
- [Leaflet Maps](https://leafletjs.com)
- [Google Gemini API](https://ai.google.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## 👥 Team & Support

For issues, questions, or feature requests, please open an issue on the project repository.

---

**Made with ❤️ for the Dhaka rental market**
