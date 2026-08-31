import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useNavigationStore } from '../../stores/useNavigationStore';
import { Home, MapPin, Heart, Building } from 'lucide-react';
import { useWishlistStore } from '../../stores/useWishlistStore';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { currentRoute, navigate } = useNavigationStore();
  const { wishlistIds } = useWishlistStore();

  const isSearch = currentRoute.name === 'search';

  return (
    <div className="min-h-screen flex flex-col bg-[#ede9e6] text-[#3f3531]">
      <Navbar />

      <main className="flex-1 w-full">
        {children}
      </main>

      {!isSearch && <Footer />}

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#ede9e6]/95 backdrop-blur-md border-t border-[#5c4f4a]/15 px-6 py-2.5 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => navigate({ name: 'home' })}
          className={`flex flex-col items-center gap-1 ${
            currentRoute.name === 'home' ? 'text-[#c9996b]' : 'text-[#5c4f4a]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold">Discover</span>
        </button>

        <button
          onClick={() => navigate({ name: 'search' })}
          className={`flex flex-col items-center gap-1 ${
            currentRoute.name === 'search' ? 'text-[#c9996b]' : 'text-[#5c4f4a]'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[10px] font-bold">Map Search</span>
        </button>

        <button
          onClick={() => navigate({ name: 'wishlist' })}
          className={`relative flex flex-col items-center gap-1 ${
            currentRoute.name === 'wishlist' ? 'text-[#c9996b]' : 'text-[#5c4f4a]'
          }`}
        >
          <Heart className="w-5 h-5" />
          {wishlistIds.length > 0 && (
            <span className="absolute -top-1 right-2 w-4 h-4 bg-[#c9996b] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {wishlistIds.length}
            </span>
          )}
          <span className="text-[10px] font-bold">Saved</span>
        </button>

        <button
          onClick={() => navigate({ name: 'host-dashboard' })}
          className={`flex flex-col items-center gap-1 ${
            currentRoute.name === 'host-dashboard' ? 'text-[#c9996b]' : 'text-[#5c4f4a]'
          }`}
        >
          <Building className="w-5 h-5" />
          <span className="text-[10px] font-bold">Host</span>
        </button>
      </div>
    </div>
  );
};
