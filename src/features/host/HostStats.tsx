import React from 'react';
import { Property, BookingRequest } from '../../types';
import { formatBDT } from '../../lib/utils';
import {
  Building,
  TrendingUp,
  FileCheck2,
  Users,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface HostStatsProps {
  properties: Property[];
  bookings: BookingRequest[];
}

export const HostStats: React.FC<HostStatsProps> = ({ properties, bookings }) => {
  const activeListings = properties.filter((p) => p.published !== false);
  const pendingRequests = bookings.filter((b) => b.status === 'Pending');
  const approvedRequests = bookings.filter((b) => b.status === 'Approved');

  // Calculate potential monthly rental revenue from active listings
  const totalMonthlyPotential = properties.reduce((acc, p) => acc + p.price, 0);

  // Total lease commitments under management
  const totalLeaseValue = bookings
    .filter((b) => b.status === 'Approved')
    .reduce((acc, b) => acc + b.totalEstimated, 0);

  return (

  );
};
