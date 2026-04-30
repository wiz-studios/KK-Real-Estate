'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  AlertCircle,
  Bath,
  Bed,
  Building2,
  CheckCircle,
  ChefHat,
  DollarSign,
  MapPin,
  Sofa,
} from 'lucide-react'
import { Property, PropertyFeature } from '@/lib/types'
import { TrustHeader } from '@/components/trust-header'
import { mockProperties } from '@/lib/mock-properties'

interface PropertyWithFeatures extends Property {
  features?: PropertyFeature[]
}

export default function PropertyDetailPage() {
  const params = useParams()
  const propertyId = params.id as string

  const [property, setProperty] = useState<PropertyWithFeatures | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [isSendingInquiry, setIsSendingInquiry] = useState(false)
  const [inquiryFeedback, setInquiryFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/properties/${propertyId}`)

        if (!response.ok) {
          throw new Error('Property not found')
        }

        const { data } = await response.json()
        setProperty(data)
      } catch (err) {
        const fallbackProperty = mockProperties.find((item) => item.id === propertyId)

        if (fallbackProperty) {
          setProperty(fallbackProperty)
          setError('Showing preview data because the live property service is unavailable locally.')
        } else {
          setError(err instanceof Error ? err.message : 'An error occurred')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperty()
  }, [propertyId])

  if (isLoading) {
    return (
      <>
        <TrustHeader />
        <main className="section-shell py-20">
          <div className="surface-panel py-20 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#d9b15f]" />
            <p className="text-white/65">Loading property profile...</p>
          </div>
        </main>
      </>
    )
  }

  if (!property) {
    return (
      <>
        <TrustHeader />
        <main className="section-shell py-20">
          <div className="surface-panel py-20 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-300" />
            <h1 className="font-display text-4xl text-white">Property not found</h1>
            <p className="mt-3 text-sm text-white/55">
              {error || 'The property you are looking for does not exist.'}
            </p>
            <Link
              href="/properties"
              className="mt-8 inline-flex rounded-full bg-[#d9b15f] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#111111]"
            >
              Back to catalogue
            </Link>
          </div>
        </main>
      </>
    )
  }

  const specItems = [
    { label: 'Plot Size', value: property.plotSize },
    { label: 'Built Area', value: property.builtArea },
    { label: 'Construction Year', value: property.constructionYear?.toString() },
    { label: 'Property Type', value: property.propertyType },
    { label: 'Availability', value: property.isAvailable ? 'Available' : 'Unavailable' },
    { label: 'Verification', value: property.verificationStatus.replace('_', ' ') },
  ].filter((item) => item.value)

  const handleInquirySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setInquiryFeedback(null)
    setIsSendingInquiry(true)

    try {
      const response = await fetch(`/api/properties/${propertyId}/inquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inquiryForm),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send inquiry')
      }

      setInquiryFeedback({
        type: 'success',
        message: result.message || 'Inquiry sent to the admin team.',
      })
      setInquiryForm({
        name: '',
        email: '',
        phone: '',
        message: '',
      })
    } catch (inquiryError) {
      setInquiryFeedback({
        type: 'error',
        message: inquiryError instanceof Error ? inquiryError.message : 'Failed to send inquiry',
      })
    } finally {
      setIsSendingInquiry(false)
    }
  }

  return (
    <>
      <TrustHeader />

      <main className="pb-20">
        <section className="section-shell py-8">
          {error && property && (
            <div className="mb-6 rounded-[1.5rem] border border-[#d9b15f]/16 bg-[#d9b15f]/10 px-5 py-4 text-sm text-[#f2deb0]">
              {error}
            </div>
          )}

          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/48">
            <Link href="/properties" className="transition-colors hover:text-[#f2dca3]">
              Properties
            </Link>
            <span>/</span>
            <span className="text-white/75">{property.title}</span>
          </div>

          <div className="grid gap-8 xl:grid-cols-[1.5fr_0.75fr]">
            <div className="space-y-6">
              <section className="surface-panel overflow-hidden">
                {property.images && property.images.length > 0 ? (
                  <div className="relative">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="h-[24rem] w-full object-cover sm:h-[30rem]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d9b15f]/24 bg-[#090909]/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#f1d89b]">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Verified Property
                      </div>
                      <h1 className="font-display text-5xl text-white sm:text-6xl">{property.title}</h1>
                      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/65">
                        <span className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#d9b15f]" />
                          {property.address}
                        </span>
                        <span>{property.city}{property.county ? `, ${property.county}` : ''}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-[24rem] items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(217,177,95,0.18),_transparent_35%),linear-gradient(150deg,#1b1b1b,#090909)]">
                    <Building2 className="h-16 w-16 text-[#d9b15f]/55" />
                  </div>
                )}
              </section>

              <section className="surface-panel p-6 sm:p-8">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="soft-card p-4">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d9b15f]/12 text-[#d9b15f]">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/45">Price</p>
                    <p className="mt-2 text-xl font-semibold text-[#f4e4b7]">
                      KES {property.price?.toLocaleString()}
                    </p>
                  </div>

                  <div className="soft-card p-4">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d9b15f]/12 text-[#d9b15f]">
                      <Bed className="h-5 w-5" />
                    </div>
                    <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/45">Bedrooms</p>
                    <p className="mt-2 text-xl font-semibold text-white">{property.bedrooms}</p>
                  </div>

                  <div className="soft-card p-4">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d9b15f]/12 text-[#d9b15f]">
                      <Bath className="h-5 w-5" />
                    </div>
                    <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/45">Bathrooms</p>
                    <p className="mt-2 text-xl font-semibold text-white">{property.bathrooms}</p>
                  </div>

                  <div className="soft-card p-4">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d9b15f]/12 text-[#d9b15f]">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/45">Total Rooms</p>
                    <p className="mt-2 text-xl font-semibold text-white">{property.totalRooms}</p>
                  </div>
                </div>
              </section>

              <section className="surface-panel p-6 sm:p-8">
                <h2 className="font-display text-4xl text-white">Interior Breakdown</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                  {[
                    { label: 'Bedrooms', value: property.bedrooms, icon: Bed },
                    { label: 'Bathrooms', value: property.bathrooms, icon: Bath },
                    { label: 'Rooms', value: property.totalRooms, icon: Building2 },
                    { label: 'Living', value: property.livingRooms, icon: Sofa },
                    { label: 'Kitchens', value: property.kitchens, icon: ChefHat },
                  ].map((item) => (
                    <div key={item.label} className="soft-card p-5 text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d9b15f]/10 text-[#d9b15f]">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/45">{item.label}</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="surface-panel p-6 sm:p-8">
                <h2 className="font-display text-4xl text-white">Property Specifications</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {specItems.map((item) => (
                    <div key={item.label} className="soft-card p-5">
                      <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/45">{item.label}</p>
                      <p className="mt-2 text-base font-medium capitalize text-white/82">{item.value}</p>
                    </div>
                  ))}
                </div>
              </section>

              {property.description && (
                <section className="surface-panel p-6 sm:p-8">
                  <h2 className="font-display text-4xl text-white">Description</h2>
                  <p className="mt-5 max-w-4xl text-base leading-8 text-white/68">{property.description}</p>
                </section>
              )}

              {property.features && property.features.length > 0 && (
                <section className="surface-panel p-6 sm:p-8">
                  <h2 className="font-display text-4xl text-white">Features & Amenities</h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {property.features.map((feature) => (
                      <div key={feature.id} className="soft-card p-5">
                        <p className="font-medium text-white">{feature.featureName}</p>
                        {feature.featureValue && (
                          <p className="mt-2 text-sm text-white/58">{feature.featureValue}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside className="xl:pt-2">
              <div className="surface-panel sticky top-28 p-6 sm:p-7">
                <div className="mb-6">
                  <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/45">Private inquiry</p>
                  <h2 className="mt-2 font-display text-4xl text-white">Request a viewing</h2>
                  <p className="mt-3 text-sm leading-7 text-white/58">
                    Send your details and the KK Real Estate team can coordinate a verified viewing.
                  </p>
                </div>

                <form onSubmit={handleInquirySubmit} className="space-y-3">
                  <input
                    type="text"
                    value={inquiryForm.name}
                    onChange={(event) =>
                      setInquiryForm((prev) => ({ ...prev, name: event.target.value }))
                    }
                    placeholder="Your name"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#d9b15f]/40 focus:outline-none"
                  />
                  <input
                    type="email"
                    value={inquiryForm.email}
                    onChange={(event) =>
                      setInquiryForm((prev) => ({ ...prev, email: event.target.value }))
                    }
                    placeholder="Your email"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#d9b15f]/40 focus:outline-none"
                  />
                  <input
                    type="tel"
                    value={inquiryForm.phone}
                    onChange={(event) =>
                      setInquiryForm((prev) => ({ ...prev, phone: event.target.value }))
                    }
                    placeholder="Your phone"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#d9b15f]/40 focus:outline-none"
                  />
                  <textarea
                    rows={5}
                    value={inquiryForm.message}
                    onChange={(event) =>
                      setInquiryForm((prev) => ({ ...prev, message: event.target.value }))
                    }
                    placeholder="Tell us what kind of viewing or follow-up you need"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#d9b15f]/40 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isSendingInquiry}
                    className="w-full rounded-full bg-[#d9b15f] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#111111] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSendingInquiry ? 'Sending inquiry...' : 'Send inquiry'}
                  </button>

                  {inquiryFeedback && (
                    <div
                      className={`rounded-[1.2rem] border px-4 py-3 text-sm ${
                        inquiryFeedback.type === 'success'
                          ? 'border-green-400/20 bg-green-400/10 text-green-100'
                          : 'border-red-400/20 bg-red-400/10 text-red-100'
                      }`}
                    >
                      {inquiryFeedback.message}
                    </div>
                  )}
                </form>

                <div className="mt-6 rounded-[1.5rem] border border-[#d9b15f]/16 bg-[#d9b15f]/10 p-4">
                  <div className="flex items-center gap-3 text-[#f1d89b]">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-semibold uppercase tracking-[0.18em]">Verified by our team</span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-white/62">
                    This listing passed the platform&apos;s verification workflow before publication.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </>
  )
}
