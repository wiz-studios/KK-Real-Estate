'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { AdminInquiryItem } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { AlertCircle, Mail, MessageSquare, Phone, UserRound } from 'lucide-react';
import { format } from 'date-fns';
import { AdminNav } from '@/components/admin/admin-nav';
import { parseSubmissionContactDetails } from '@/lib/property-submission';

export default function AdminInquiriesPage() {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  const [inquiries, setInquiries] = useState<AdminInquiryItem[]>([]);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isLoading && (!session.isAuthenticated || !session.isAdmin)) {
      router.push('/admin/login');
    }
  }, [session, isLoading, router]);

  useEffect(() => {
    if (!session.isAuthenticated || !session.user) return;

    const fetchInquiries = async () => {
      try {
        setIsLoadingInquiries(true);
        setError(null);

        const response = await fetch('/api/admin/inquiries', {
          headers: {
            'x-user-id': session.user?.id || '',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch inquiries');
        }

        const { data } = await response.json();
        setInquiries(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoadingInquiries(false);
      }
    };

    fetchInquiries();
  }, [session.user, session.isAuthenticated]);

  const filteredInquiries = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return inquiries;
    }

    return inquiries.filter((inquiry) =>
      [
        inquiry.propertyTitle,
        inquiry.propertyCity,
        inquiry.propertyCounty,
        inquiry.name,
        inquiry.email,
        inquiry.phone,
        inquiry.message,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [inquiries, search]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-yellow-500"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session.isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AdminNav />

        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black sm:text-4xl">Admin Inquiries</h1>
            <p className="mt-2 text-gray-600">Every viewing request and lead in one place.</p>
          </div>

          <div className="w-full max-w-md">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by property, lead name, email, phone, or message"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-yellow-500 focus:outline-none"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
            <p className="mt-2 text-3xl font-bold text-black">{inquiries.length}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm font-medium text-gray-600">Showcase Leads</p>
            <p className="mt-2 text-3xl font-bold text-black">
              {inquiries.filter((item) =>
                parseSubmissionContactDetails(item.propertyVerificationNotes).isShowcaseLead,
              ).length}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm font-medium text-gray-600">Filtered Results</p>
            <p className="mt-2 text-3xl font-bold text-black">{filteredInquiries.length}</p>
          </div>
        </div>

        <div className="space-y-4">
          {isLoadingInquiries ? (
            <div className="rounded-2xl border border-gray-200 bg-white py-12 text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-yellow-500"></div>
              <p className="text-gray-600">Loading inquiries...</p>
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white py-12 text-center text-gray-600">
              No inquiries found.
            </div>
          ) : (
            filteredInquiries.map((inquiry) => {
              const sourceDetails = parseSubmissionContactDetails(inquiry.propertyVerificationNotes);
              const sourceLabel = sourceDetails.isShowcaseLead
                ? 'Showcase inquiry'
                : sourceDetails.isPublicSubmission
                  ? 'Public submission property'
                  : 'Live property';

              return (
                <div key={inquiry.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="flex gap-4">
                      <div className="h-24 w-28 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                        {inquiry.propertyImage ? (
                          <img
                            src={inquiry.propertyImage}
                            alt={inquiry.propertyTitle}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : null}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg font-semibold text-black">{inquiry.propertyTitle}</h2>
                          <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-800">
                            {sourceLabel}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          {[inquiry.propertyCity, inquiry.propertyCounty].filter(Boolean).join(', ') || 'No location'}
                        </p>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                          {inquiry.inquiryType || 'General inquiry'}
                        </p>
                        <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Lead message</p>
                          <p className="mt-2 text-sm leading-6 text-gray-700">{inquiry.message || 'No message provided.'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Lead contact</p>
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <UserRound className="h-4 w-4 text-gray-400" />
                        <span>{inquiry.name || 'Unnamed contact'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{inquiry.email || 'No email'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{inquiry.phone || 'No phone'}</span>
                      </div>
                      <div className="flex items-start gap-3 pt-2 text-sm text-gray-700">
                        <MessageSquare className="mt-0.5 h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">Received</p>
                          <p>{format(new Date(inquiry.createdAt), 'dd MMM yyyy, HH:mm')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
