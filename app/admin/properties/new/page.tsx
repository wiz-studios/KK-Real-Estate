'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { PropertyForm } from '@/components/admin/property-form';
import { AdminNav } from '@/components/admin/admin-nav';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

export default function AddPropertyPage() {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && (!session.isAuthenticated || !session.isAdmin)) {
      router.push('/admin/login');
    }
  }, [session, isLoading, router]);

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'imageFiles') {
          return
        }

        payload.append(key, String(value ?? ''))
      })

      ;(formData.imageFiles || []).forEach((file: File) => {
        payload.append('images', file)
      })

      const response = await fetch('/api/admin/properties', {
        method: 'POST',
        headers: {
          'x-user-id': session.user?.id || ''
        },
        body: payload
      });

      if (!response.ok) {
        const { error: apiError } = await response.json();
        throw new Error(apiError || 'Failed to create property');
      }

      const { data } = await response.json();
      router.push(`/admin/properties/${data.id}/verify`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsSubmitting(false);
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminNav />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black">Add New Property</h1>
          <p className="text-gray-600 mt-2">Fill in the property details. This property will be pending verification until you review the information.</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <PropertyForm
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />

        {/* Info Box */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Important</h3>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
            <li>Only admins can add properties after physical verification</li>
            <li>Properties start in pending status</li>
            <li>You will need to verify the property details after creation</li>
            <li>Verified properties will be visible to users</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
