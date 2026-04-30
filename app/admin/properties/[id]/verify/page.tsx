'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Property } from '@/lib/types';
import { AdminNav } from '@/components/admin/admin-nav';
import { useRouter, useParams } from 'next/navigation';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function VerifyPropertyPage() {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [isLoadingProp, setIsLoadingProp] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'verified' | 'rejected'>('verified');

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && (!session.isAuthenticated || !session.isAdmin)) {
      router.push('/admin/login');
    }
  }, [session, isLoading, router]);

  // Fetch property
  useEffect(() => {
    if (!session.isAuthenticated || !session.user) return;

    const fetchProperty = async () => {
      try {
        setIsLoadingProp(true);
        const response = await fetch(`/api/admin/properties/${propertyId}`, {
          headers: {
            'x-user-id': session.user?.id || ''
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch property');
        }

        const { data } = await response.json();
        setProperty(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoadingProp(false);
      }
    };

    fetchProperty();
  }, [propertyId, session.user, session.isAuthenticated]);

  const handleVerify = async () => {
    if (!property) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/properties/${propertyId}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': session.user?.id || ''
        },
        body: JSON.stringify({
          status: selectedStatus,
          notes: notes || null
        })
      });

      if (!response.ok) {
        throw new Error('Failed to verify property');
      }

      router.push('/admin/dashboard');
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
          <h1 className="text-4xl font-bold text-black">Verify Property</h1>
          <p className="text-gray-600 mt-2">Review the property details and decide whether to verify or reject it</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {isLoadingProp ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading property...</p>
          </div>
        ) : !property ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">Property not found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Property Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Info */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-2xl font-bold text-black mb-4">{property.title}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">Property Type</p>
                    <p className="font-semibold text-black capitalize">{property.propertyType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Price</p>
                    <p className="font-semibold text-black">KES {property.price?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Location</p>
                    <p className="font-semibold text-black">{property.city}, {property.county}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Address</p>
                    <p className="font-semibold text-black">{property.address}</p>
                  </div>
                </div>
              </div>

              {property.images && property.images.length > 0 && (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-black mb-4">Submitted Images</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.images.map((image, index) => (
                      <div key={`${image}-${index}`} className="overflow-hidden rounded-lg border border-gray-200">
                        <img src={image} alt={`${property.title} ${index + 1}`} className="h-56 w-full object-cover" />
                        <div className="p-3 text-xs text-gray-500 break-all">{image}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Room Details */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold text-black mb-4">Room Details</h3>
                <div className="grid grid-cols-5 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">Total Rooms</p>
                    <p className="text-2xl font-bold text-black">{property.totalRooms}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Bedrooms</p>
                    <p className="text-2xl font-bold text-black">{property.bedrooms}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Bathrooms</p>
                    <p className="text-2xl font-bold text-black">{property.bathrooms}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Living Rooms</p>
                    <p className="text-2xl font-bold text-black">{property.livingRooms}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Kitchens</p>
                    <p className="text-2xl font-bold text-black">{property.kitchens}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {property.description && (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-black mb-4">Description</h3>
                  <p className="text-gray-700">{property.description}</p>
                </div>
              )}

              {property.verificationNotes && (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-black mb-4">Submission Notes & Contact</h3>
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-6">
                    {property.verificationNotes}
                  </pre>
                </div>
              )}
            </div>

            {/* Verification Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg border border-gray-200 sticky top-8">
                <h3 className="font-bold text-black mb-6">Verification Decision</h3>

                {/* Status Options */}
                <div className="space-y-3 mb-6">
                  <label className="flex items-center gap-3 p-4 border-2 border-green-200 rounded-lg cursor-pointer hover:bg-green-50" onClick={() => setSelectedStatus('verified')}>
                    <input
                      type="radio"
                      name="status"
                      value="verified"
                      checked={selectedStatus === 'verified'}
                      onChange={() => setSelectedStatus('verified')}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="font-semibold text-green-900">Verify</p>
                      <p className="text-xs text-green-700">Approve this property</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 border-red-200 rounded-lg cursor-pointer hover:bg-red-50" onClick={() => setSelectedStatus('rejected')}>
                    <input
                      type="radio"
                      name="status"
                      value="rejected"
                      checked={selectedStatus === 'rejected'}
                      onChange={() => setSelectedStatus('rejected')}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="font-semibold text-red-900">Reject</p>
                      <p className="text-xs text-red-700">Decline this property</p>
                    </div>
                  </label>
                </div>

                {/* Notes */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes about this verification..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleVerify}
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {selectedStatus === 'verified' ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Verify Property
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5" />
                      Reject Property
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
