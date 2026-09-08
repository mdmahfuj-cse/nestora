import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building,
  Plus,
  TrendingUp,
  FileCheck2,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Flame,
  CheckCircle2,
  MapPin,
  Calendar
} from 'lucide-react';
import { useHostStore } from '../stores/useHostStore';
import { useBookingStore } from '../stores/useBookingStore';
import { useNavigationStore } from '../stores/useNavigationStore';
import { HostStats } from '../features/host/HostStats';
import { ListingWizard } from '../features/host/ListingWizard';
import { PropertyManagementTable } from '../features/host/PropertyManagementTable';
import { BookingRequestsList } from '../features/host/BookingRequestsList';
import { Property } from '../types';
import { formatBDT } from '../lib/utils';

export const HostDashboardPage: React.FC = () => {
  const { properties } = useHostStore();
  const { bookingRequests } = useBookingStore();
  const { currentRoute, navigate } = useNavigationStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'inquiries' | 'wizard'>('overview');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  const handleStartAdd = () => {
    setEditingProperty(null);
    setActiveTab('wizard');
  };

  const handleStartEdit = (prop: Property) => {
    setEditingProperty(prop);
    setActiveTab('wizard');
  };

  const handleWizardComplete = () => {
    setEditingProperty(null);
    setActiveTab('properties');
  };

  const handleWizardCancel = () => {
    setEditingProperty(null);
    setActiveTab('properties');
  };

  return (

  );
};
