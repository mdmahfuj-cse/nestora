import { create } from 'zustand';
import { BookingRequest } from '../types';

interface BookingState {
  bookingRequests: BookingRequest[];
  addBookingRequest: (request: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>) => BookingRequest;
  updateBookingStatus: (id: string, status: BookingRequest['status']) => void;
}

const STORAGE_KEY = 'nestora_booking_requests';

const initialMockBookings: BookingRequest[] = [
  {
    id: 'req-1',
    propertyId: 'prop-1',
    propertyTitle: 'Lakeside Panoramic Penthouse with Private Terrace',
    propertyImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    location: 'Gulshan-2, Dhaka',
    monthlyRent: 185000,
    serviceCharge: 15000,
    moveInDate: '2026-09-15',
    months: 6,
    occupants: 3,
    totalEstimated: 1200000,
    status: 'Pending',
    createdAt: '2026-08-28T14:30:00Z',
    userName: 'Kazi Mahbub',
    userPhone: '+880 1712-334455',
    userEmail: 'kazi.mahbub@gmail.com',
    message: 'We are returning from Canada for a 6-month consulting project in Gulshan.',
  },
  {
    id: 'req-2',
    propertyId: 'prop-2',
    propertyTitle: 'Minimalist Scandinavian 3BHK in Prime Banani',
    propertyImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
    location: 'Banani Block D, Dhaka',
    monthlyRent: 95000,
    serviceCharge: 8000,
    moveInDate: '2026-10-01',
    months: 12,
    occupants: 2,
    totalEstimated: 1236000,
    status: 'Approved',
    createdAt: '2026-08-25T09:15:00Z',
    userName: 'Samira Anjum',
    userPhone: '+880 1819-445566',
    userEmail: 'samira.anjum@outlook.com',
    message: 'Interested in a long-term 1-year corporate lease.',
  },
];

const loadBookings = (): BookingRequest[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return initialMockBookings;
};

export const useBookingStore = create<BookingState>((set) => ({
  bookingRequests: loadBookings(),

  addBookingRequest: (data) => {
    const newReq: BookingRequest = {
      ...data,
      id: `req-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'Pending',
    };
    set((state) => {
      const updated = [newReq, ...state.bookingRequests];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return { bookingRequests: updated };
    });
    return newReq;
  },

  updateBookingStatus: (id, status) => {
    set((state) => {
      const updated = state.bookingRequests.map((b) =>
        b.id === id ? { ...b, status } : b
      );
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return { bookingRequests: updated };
    });
  },
}));
