import React, { useState } from 'react';
import { Property } from '../../types';
import { useHostStore } from '../../stores/useHostStore';
import { useNavigationStore } from '../../stores/useNavigationStore';
import { formatBDT } from '../../lib/utils';
import {
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  MapPin,
  Search,
  Building,
  AlertTriangle,
  Plus,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PropertyManagementTableProps {
  onEdit: (property: Property) => void;
  onAddNew: () => void;
}

export const PropertyManagementTable: React.FC<PropertyManagementTableProps> = ({
  onEdit,
  onAddNew,
}) => {
  const { properties, togglePublish, deleteProperty } = useHostStore();
  const { navigate } = useNavigationStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredProperties = properties.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.area.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.propertyType.toLowerCase().includes(q)
    );
  });

  const handleDelete = (id: string) => {
    deleteProperty(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* Table Top Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#5c4f4a]/60 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search your Dhaka properties by title, road, or area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white pl-10 pr-4 py-2.5 rounded-2xl border border-[#5c4f4a]/15 text-xs text-[#3f3531] placeholder-[#5c4f4a]/50 focus:outline-none focus:ring-2 focus:ring-[#c9996b]"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={onAddNew}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#c9996b] hover:bg-[#b07e4f] text-white text-xs font-bold shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          List Another Property
        </button>
      </div>

      {/* Property Cards / Table Container */}
      <div className="bg-white rounded-3xl border border-[#5c4f4a]/15 shadow-sm overflow-hidden">
        {filteredProperties.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#ede9e6] flex items-center justify-center mx-auto text-[#5c4f4a]">
              <Building className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold font-['Outfit'] text-[#3f3531]">
              No properties found
            </h4>
            <p className="text-xs text-[#5c4f4a]/75 max-w-xs mx-auto">
              {searchTerm
                ? 'Try adjusting your search keywords.'
                : 'Start by creating your first Dhaka residential listing.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#5c4f4a]/10">
            {filteredProperties.map((property) => {
              const isPublished = property.published !== false;
              return (
                <div
                  key={property.id}
                  className="p-4 sm:p-6 hover:bg-[#ede9e6]/30 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 border border-[#5c4f4a]/10"
                    />

                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-[#ede9e6] text-[#3f3531] text-[10px] font-bold">
                          {property.area}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#c9996b]/15 text-[#5c4f4a] text-[10px] font-bold">
                          {property.propertyType}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 ${
                            isPublished
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {isPublished ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> Live on Portal
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" /> Paused / Draft
                            </>
                          )}
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-bold font-['Outfit'] text-[#3f3531] line-clamp-1">
                        {property.title}
                      </h4>

                      <p className="text-xs text-[#5c4f4a]/80 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#c9996b] shrink-0" />
                        <span className="truncate">{property.location}</span>
                      </p>

                      <div className="flex items-center gap-3 text-xs font-semibold text-[#5c4f4a] pt-1">
                        <span>{property.bedrooms} Beds</span>
                        <span>•</span>
                        <span>{property.bathrooms} Baths</span>
                        <span>•</span>
                        <span>{property.areaSqFt} Sq Ft</span>
                        <span>•</span>
                        <span className="font-bold text-[#3f3531]">
                          {formatBDT(property.price)}/mo
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    {/* View Live */}
                    <button
                      onClick={() => navigate({ name: 'property', id: property.id })}
                      className="p-2.5 rounded-xl bg-[#ede9e6] hover:bg-[#5c4f4a] text-[#5c4f4a] hover:text-white transition-colors"
                      title="View Live Listing Page"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => onEdit(property)}
                      className="p-2.5 rounded-xl bg-[#ede9e6] hover:bg-[#c9996b] text-[#5c4f4a] hover:text-white transition-colors"
                      title="Edit Specifications & Photos"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    {/* Toggle Status */}
                    <button
                      onClick={() => togglePublish(property.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                        isPublished
                          ? 'bg-amber-100/70 hover:bg-amber-200 text-amber-800'
                          : 'bg-emerald-100/70 hover:bg-emerald-200 text-emerald-800'
                      }`}
                      title={isPublished ? 'Pause Listing' : 'Publish Listing'}
                    >
                      {isPublished ? 'Pause' : 'Publish'}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setDeleteConfirmId(property.id)}
                      className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white transition-colors"
                      title="Delete Property"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#5c4f4a]/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#5c4f4a]/20 space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold font-['Outfit'] text-[#3f3531]">
                  Delete this listing?
                </h3>
                <p className="text-xs text-[#5c4f4a]/75">
                  This action will permanently remove this Dhaka property from your active host portfolio and search results.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-5 py-2.5 rounded-xl border border-[#5c4f4a]/20 text-xs font-bold text-[#5c4f4a] hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-colors"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
