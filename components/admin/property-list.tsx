'use client';

import { Property } from '@/lib/types';
import { parseSubmissionContactDetails } from '@/lib/property-submission';
import {
  CheckCircle,
  Clock,
  Edit,
  Eye,
  Mail,
  MessageSquare,
  Phone,
  Trash,
  UserRound,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';

interface PropertyListProps {
  properties: Property[];
  isLoading?: boolean;
  onDelete?: (id: string) => Promise<void>;
}

export function PropertyList({ properties, isLoading, onDelete }: PropertyListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <div className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
            <CheckCircle className="h-4 w-4" />
            Verified
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
            <Clock className="h-4 w-4" />
            Pending
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
            <XCircle className="h-4 w-4" />
            Rejected
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">Loading properties...</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">No properties found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1100px]">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Listing</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Contact / Lead</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price / Specs</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Activity</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {properties.map((property) => {
            const submissionDetails = parseSubmissionContactDetails(property.verificationNotes);

            return (
              <tr key={property.id} className="align-top hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                      {property.images?.[0] ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold text-gray-900">{property.title}</p>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            submissionDetails.isPublicSubmission
                              ? 'bg-amber-100 text-amber-800'
                              : submissionDetails.isShowcaseLead
                                ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {submissionDetails.isPublicSubmission
                            ? 'Public submission'
                            : submissionDetails.isShowcaseLead
                              ? 'Showcase inquiry'
                              : 'Admin added'}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        {property.city}, {property.county || 'No county'}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gray-400">
                        {property.propertyType}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  <div className="space-y-2">
                    {submissionDetails.contactName || submissionDetails.contactEmail || submissionDetails.contactPhone ? (
                      <>
                        {submissionDetails.contactName && (
                          <div className="flex items-center gap-2">
                            <UserRound className="h-4 w-4 text-gray-400" />
                            <span>{submissionDetails.contactName}</span>
                          </div>
                        )}
                        {submissionDetails.contactEmail && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>{submissionDetails.contactEmail}</span>
                          </div>
                        )}
                        {submissionDetails.contactPhone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{submissionDetails.contactPhone}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-gray-400">No public submission contact saved.</p>
                    )}

                    {property.latestInquiry && (
                      <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                          Latest inquiry
                        </p>
                        <p className="mt-2 text-sm font-medium text-gray-900">
                          {property.latestInquiry.name || property.latestInquiry.email || 'Lead contact'}
                        </p>
                        {property.latestInquiry.phone && (
                          <p className="mt-1 text-sm text-gray-600">{property.latestInquiry.phone}</p>
                        )}
                        {property.latestInquiry.message && (
                          <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                            {property.latestInquiry.message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  <p className="font-semibold text-gray-900">KES {property.price?.toLocaleString()}</p>
                  <p className="mt-2 text-sm text-gray-600">
                    {property.bedrooms} bed, {property.bathrooms} bath, {property.totalRooms} rooms
                  </p>
                </td>

                <td className="px-6 py-4">
                  <div className="space-y-3">
                    {getStatusBadge(property.verificationStatus)}
                    {submissionDetails.ownerNotes && (
                      <p className="max-w-xs text-sm text-gray-500">{submissionDetails.ownerNotes}</p>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-gray-400" />
                      <span>{property.viewsCount} views</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                      <span>{property.inquiryCount || 0} inquiries</span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/properties/${property.id}/edit`}
                      className="text-yellow-600 hover:text-yellow-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => onDelete?.(property.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                    {property.verificationStatus === 'pending' && (
                      <Link
                        href={`/admin/properties/${property.id}/verify`}
                        className="font-medium text-blue-600 hover:text-blue-700"
                      >
                        Verify
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
