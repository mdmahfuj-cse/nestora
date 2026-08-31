export type PropertyType =
  | 'Apartment'
  | 'Penthouse'
  | 'Service Apartment'
  | 'Serviced Room'
  | 'Student Accommodation'
  | 'Duplex'
  | 'House'
  | 'Room'
  | 'Studio'
  | 'Villa';

export type FurnishedStatus = 'Furnished' | 'Semi-Furnished' | 'Unfurnished';

export type Amenity =
  | 'WiFi'
  | 'AC'
  | 'Parking'
  | 'Lift'
  | 'Generator'
  | 'Security'
  | 'Balcony'
  | 'Washing machine'
  | 'Gas Pipeline'
  | 'Gym'
  | 'Swimming Pool'
  | 'CCTV';

export interface Review {
  id: string;
  author: string;
  avatar: string;
  date: string;
  rating: number;
  comment: string;
  cleanliness?: number;
  accuracy?: number;
  communication?: number;
  locationRating?: number;
  value?: number;
}

export interface Host {
  id: string;
  name: string;
  photo: string;
  rating: number;
  reviewCount: number;
  responseRate: string;
  responseTime: string;
  joinedYear: string;
  verified: boolean;
  phone: string;
  email: string;
  bio: string;
  propertiesCount: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  area: string; // e.g. "Gulshan-2", "Banani Block D", "Dhanmondi 27", "Uttara Sector 4"
  city: string;
  price: number; // Monthly rent in BDT
  serviceCharge?: number;
  securityDeposit?: number;
  lat: number;
  lng: number;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  floor?: string;
  propertyType: PropertyType;
  furnished: FurnishedStatus;
  amenities: Amenity[];
  images: string[];
  rating: number;
  reviewCount: number;
  reviews: Review[];
  hostId: string;
  availability: 'Available Now' | 'From Next Month' | 'Booked';
  isFeatured?: boolean;
  published?: boolean;
  createdAt: string;
  billsIncluded?: boolean;
  petFriendly?: boolean;
  virtualTour?: VirtualTourData;
}

export type HotspotType = 'navigation' | 'feature' | 'utility' | 'dimension';

export interface TourHotspot {
  id: string;
  yaw: number; // horizontal angle in degrees (0 to 360)
  pitch: number; // vertical angle in degrees (-85 to 85)
  title: string;
  type: HotspotType;
  description?: string;
  targetRoomId?: string; // for navigation hotspots
  tag?: string; // e.g. "Titas Gas", "Generator Backed", "Balcony View"
  details?: {
    spec?: string;
    brand?: string;
    verified?: boolean;
    image?: string;
  };
}

export interface TourMeasurement {
  id: string;
  label: string;
  value: string; // e.g. "18.5 ft x 14.2 ft", "Ceiling Height: 10.5 ft"
  yaw: number;
  pitch: number;
}

export interface VirtualTourRoom {
  id: string;
  name: string;
  roomType: 'living' | 'bedroom' | 'kitchen' | 'balcony' | 'bathroom' | 'dining' | 'study';
  panoramaUrl: string;
  thumbnail: string;
  initialYaw?: number;
  initialPitch?: number;
  hotspots: TourHotspot[];
  measurements?: TourMeasurement[];
  floorplanCoords?: { x: number; y: number }; // percentage position on mini-map (0-100)
}

export interface VirtualTourData {
  id: string;
  propertyTitle: string;
  defaultRoomId: string;
  floorplanUrl?: string;
  rooms: VirtualTourRoom[];
}

export interface BookingRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  location: string;
  monthlyRent: number;
  serviceCharge: number;
  moveInDate: string;
  months: number;
  occupants: number;
  totalEstimated: number;
  status: 'Pending' | 'Approved' | 'Declined' | 'Completed';
  createdAt: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  message?: string;
}

export interface FilterState {
  search: string;
  location: string;
  propertyType: PropertyType | 'All';
  minPrice: number;
  maxPrice: number;
  bedrooms: number | 'any';
  bathrooms: number | 'any';
  furnished: FurnishedStatus | 'All';
  amenities: Amenity[];
  availability: string;
  sortBy: 'recommended' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

export type PageRoute =
  | { name: 'home' }
  | { name: 'search'; params?: Record<string, string> }
  | { name: 'property'; id: string }
  | { name: 'wishlist' }
  | { name: 'compare' }
  | { name: 'neighborhoods'; area?: string }
  | { name: 'agreement'; propertyId?: string }
  | { name: 'host-dashboard'; tab?: 'overview' | 'properties' | 'add' | 'edit' | 'inquiries' | 'analytics'; editId?: string };
