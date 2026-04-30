'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Property } from '@/lib/types';
import { PropertyList } from '@/components/admin/property-list';
import { AdminNav } from '@/components/admin/admin-nav';
import Link from 'next/link';
import { Plus, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoadingProps, setIsLoadingProps] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    verified: 0,
    rejected: 0
  });

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && (!session.isAuthenticated || !session.isAdmin)) {
      router.push('/admin/login');
    }
  }, [session, isLoading, router]);

  // Fetch properties
  useEffect(() => {
    if (!session.isAuthenticated || !session.user) return;

    const fetchProperties = async () => {
      try {
        setIsLoadingProps(true);
        setError(null);

        const params = new URLSearchParams();
        if (filter !== 'all') {
          params.append('status', filter);
        }

        const response = await fetch(`/api/admin/properties?${params}`, {
          headers: {
            'x-user-id': session.user?.id || ''
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }

        const { data, pagination } = await response.json();
        setProperties(data);

        // Update stats
        const allResponse = await fetch('/api/admin/properties', {
          headers: {
            'x-user-id': session.user?.id || ''
          }
        });

        if (allResponse.ok) {
          const allData = await allResponse.json();
          const allProps = allData.data;
          setStats({
            total: allProps.length,
            pending: allProps.filter((p: Property) => p.verificationStatus === 'pending').length,
            verified: allProps.filter((p: Property) => p.verificationStatus === 'verified').length,
            rejected: allProps.filter((p: Property) => p.verificationStatus === 'rejected').length
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoadingProps(false);
      }
    };

    fetchProperties();
  }, [filter, session.user, session.isAuthenticated]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      const response = await fetch(`/api/admin/properties/${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': session.user?.id || ''
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete property');
      }

      setProperties(properties.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session.isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600 mt-2">You do not have permission to access this page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminNav />

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black sm:text-4xl">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage properties and verify listings</p>
          </div>
          <Link
            href="/admin/properties/new"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-black transition-colors hover:bg-yellow-600 sm:w-auto"
          >
            <Plus className="w-5 h-5" />
            Add Property
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm font-medium mb-1">Total Properties</p>
            <p className="text-3xl font-bold text-black">{stats.total}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm font-medium mb-1">Pending Verification</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm font-medium mb-1">Verified</p>
            <p className="text-3xl font-bold text-green-600">{stats.verified}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm font-medium mb-1">Rejected</p>
            <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          {(['all', 'pending', 'verified', 'rejected'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                filter === f
                  ? 'bg-yellow-500 text-black'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Properties List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {isLoadingProps ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading properties...</p>
            </div>
          ) : (
            <PropertyList
              properties={properties}
              onDelete={handleDelete}
              isLoading={isLoadingProps}
            />
          )}
        </div>
      </div>
    </div>
  );
}
