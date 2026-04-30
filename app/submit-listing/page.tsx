'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CircleCheckBig, Home, ShieldCheck } from 'lucide-react'
import { TrustHeader } from '@/components/trust-header'
import { PropertyType } from '@/lib/types'
import { ImageUploadField } from '@/components/ui/image-upload-field'
import { KenyaCountyCombobox } from '@/components/ui/kenya-county-combobox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const propertyTypes: PropertyType[] = [
  'bungalow',
  'flatroof',
  'townhouse',
  'apartment',
  'penthouse',
  'villa',
  'mansion',
  'cottage',
  'duplex',
  'studio',
]

export default function SubmitListingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successId, setSuccessId] = useState<string | null>(null)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [formData, setFormData] = useState({
    submitterName: '',
    submitterEmail: '',
    submitterPhone: '',
    title: '',
    propertyType: 'villa' as PropertyType,
    address: '',
    city: '',
    county: '',
    price: '',
    totalRooms: '6',
    bedrooms: '4',
    bathrooms: '4',
    livingRooms: '1',
    kitchens: '1',
    plotSize: '',
    builtArea: '',
    constructionYear: '2020',
    latitude: '',
    longitude: '',
    description: '',
    submitterNotes: '',
  })

  const inputClassName =
    'w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#d9b15f]/40 focus:outline-none'

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccessId(null)
    setIsSubmitting(true)

    try {
      if (imageFiles.length === 0) {
        throw new Error('Please upload at least one property image.')
      }

      const payload = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value)
      })
      imageFiles.forEach((file) => payload.append('images', file))

      const response = await fetch('/api/properties/submit', {
        method: 'POST',
        body: payload,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit listing')
      }

      setSuccessId(result.data.id)
      setFormData({
        submitterName: '',
        submitterEmail: '',
        submitterPhone: '',
        title: '',
        propertyType: 'villa',
        address: '',
        city: '',
        county: '',
        price: '',
        totalRooms: '6',
        bedrooms: '4',
        bathrooms: '4',
        livingRooms: '1',
        kitchens: '1',
        plotSize: '',
        builtArea: '',
        constructionYear: '2020',
        latitude: '',
        longitude: '',
        description: '',
        submitterNotes: '',
      })
      setImageFiles([])
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Submission failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <TrustHeader />

      <main className="pb-20">
        <section className="section-shell grid gap-10 py-12 lg:grid-cols-[0.75fr_1.25fr] lg:py-16">
          <div className="space-y-6">
            <div className="eyebrow">
              <Home className="h-3.5 w-3.5" />
              Public listing submission
            </div>
            <h1 className="font-display text-5xl text-white sm:text-6xl">
              Submit a property for admin review.
            </h1>
            <p className="text-base leading-8 text-white/68">
              Send the listing details, contact information, and property photos. The admin team will
              review the submission before anything goes live.
            </p>

            <div className="surface-panel p-6">
              <h2 className="font-display text-3xl text-white">What happens next</h2>
              <div className="mt-5 space-y-4 text-sm leading-7 text-white/65">
                <p>1. Your listing is stored as pending and stays hidden from the public catalogue.</p>
                <p>2. Admin reviews the details, contact information, and image set.</p>
                <p>3. Only approved and verified listings become publicly visible.</p>
              </div>
            </div>

            <div className="soft-card p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 text-[#d9b15f]" />
                <div>
                  <p className="font-semibold text-white">Minimum submission package</p>
                  <p className="mt-2 text-sm leading-7 text-white/58">
                    Use clear JPG or PNG property images, accurate address details, realistic pricing, and a
                    reachable owner or agent phone number. Incomplete submissions slow the approval queue.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="surface-panel p-6 sm:p-8">
            {successId && (
              <div className="mb-6 rounded-[1.5rem] border border-green-400/20 bg-green-400/10 px-5 py-4 text-sm text-green-100">
                Listing submitted successfully. Reference ID: {successId}
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-[1.5rem] border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/50">
                    Contact Name
                  </label>
                  <input name="submitterName" value={formData.submitterName} onChange={handleChange} className={inputClassName} required />
                </div>
                <div>
                  <label className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/50">
                    Contact Email
                  </label>
                  <input type="email" name="submitterEmail" value={formData.submitterEmail} onChange={handleChange} className={inputClassName} required />
                </div>
                <div>
                  <label className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/50">
                    Contact Phone
                  </label>
                  <input name="submitterPhone" value={formData.submitterPhone} onChange={handleChange} className={inputClassName} required />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/50">
                    Property Title
                  </label>
                  <input name="title" value={formData.title} onChange={handleChange} className={inputClassName} required />
                </div>
                <div>
                  <label className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/50">
                    Property Type
                  </label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, propertyType: value as PropertyType }))
                    }
                  >
                    <SelectTrigger className="h-[50px] w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white shadow-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border border-[#d9b15f]/20 bg-[#111111] text-white shadow-[0_24px_50px_rgba(0,0,0,0.55)]">
                      {propertyTypes.map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="rounded-xl px-3 py-3 text-white focus:bg-[#d9b15f]/14 focus:text-[#f2dca3]"
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/50">
                    Address
                  </label>
                  <input name="address" value={formData.address} onChange={handleChange} className={inputClassName} required />
                </div>
                <div>
                  <label className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/50">
                    Price (KES)
                  </label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} className={inputClassName} required />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <label className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/50">
                    City/Town
                  </label>
                  <input name="city" value={formData.city} onChange={handleChange} className={inputClassName} required />
                </div>
                <div>
                  <label className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/50">
                    County
                  </label>
                  <KenyaCountyCombobox
                    value={formData.county}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, county: value }))}
                    placeholder="Search Kenya county"
                    tone="dark"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/50">
                    Latitude
                  </label>
                  <input name="latitude" value={formData.latitude} onChange={handleChange} className={inputClassName} />
                </div>
                <div>
                  <label className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/50">
                    Longitude
                  </label>
                  <input name="longitude" value={formData.longitude} onChange={handleChange} className={inputClassName} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-7">
                {[
                  ['totalRooms', 'Total Rooms'],
                  ['bedrooms', 'Bedrooms'],
                  ['bathrooms', 'Bathrooms'],
                  ['livingRooms', 'Living Rooms'],
                  ['kitchens', 'Kitchens'],
                  ['constructionYear', 'Year'],
                ].map(([name, label]) => (
                  <div key={name}>
                    <label className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/50">
                      {label}
                    </label>
                    <input type="number" name={name} value={(formData as any)[name]} onChange={handleChange} className={inputClassName} required />
                  </div>
                ))}

                <div>
                  <label className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/50">
                    Built Area
                  </label>
                  <input name="builtArea" value={formData.builtArea} onChange={handleChange} className={inputClassName} />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/50">
                  Plot Size
                </label>
                <input name="plotSize" value={formData.plotSize} onChange={handleChange} className={inputClassName} />
              </div>

              <div>
                <label className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/50">
                  Property Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className={inputClassName}
                  required
                />
              </div>

              <ImageUploadField
                files={imageFiles}
                onFilesChange={setImageFiles}
                onError={setError}
                maxFiles={10}
                maxFileSizeMb={5}
                tone="dark"
              />

              <div>
                <label className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/50">
                  Submission Notes
                </label>
                <textarea
                  name="submitterNotes"
                  value={formData.submitterNotes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Access notes, occupancy status, preferred contact times, or anything the admin should review."
                  className={inputClassName}
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-white/52">
                  By submitting, you confirm the information is accurate and ready for admin review.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d9b15f] px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#111111] disabled:opacity-60"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Listing'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>

            <div className="mt-8 rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5 text-sm text-white/58">
              <div className="flex items-start gap-3">
                <CircleCheckBig className="mt-1 h-5 w-5 text-[#d9b15f]" />
                <p>
                  Verified listings only go live after admin approval. If you need faster turnaround,
                  include complete room counts, clear property photos, and a precise address.
                </p>
              </div>
            </div>

            <div className="mt-6 text-sm text-white/50">
              Need to browse instead?{' '}
              <Link href="/properties" className="text-[#f0d899] hover:text-white">
                View verified properties
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
