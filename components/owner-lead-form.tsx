'use client'

import { FormEvent, useState } from 'react'
import { ArrowRight, CheckCircle2, MessageCircleMore } from 'lucide-react'
import { ImageUploadField } from '@/components/ui/image-upload-field'

const WHATSAPP_URL =
  'https://wa.me/254700000000?text=Hello%20KK%20Real%20Estate%2C%20I%20want%20to%20list%20my%20house.'

export function OwnerLeadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successId, setSuccessId] = useState<string | null>(null)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    propertyLocation: '',
    price: '',
    plotSize: '',
    bedrooms: '3',
    bathrooms: '2',
  })

  const inputClassName =
    'w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#d9b15f]/40 focus:outline-none'

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccessId(null)

    try {
      if (imageFiles.length === 0) {
        throw new Error('Please upload at least one house image.')
      }

      const payload = new FormData()
      Object.entries(formData).forEach(([key, value]) => payload.append(key, value))
      imageFiles.forEach((file) => payload.append('images', file))

      const response = await fetch('/api/owner-leads', {
        method: 'POST',
        body: payload,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send your property lead.')
      }

      setSuccessId(result.data.id)
      setFormData({
        name: '',
        phone: '',
        propertyLocation: '',
        price: '',
        plotSize: '',
        bedrooms: '3',
        bathrooms: '2',
      })
      setImageFiles([])
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Submission failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="surface-panel p-6 sm:p-8">
      {successId && (
        <div className="mb-6 rounded-[1.5rem] border border-green-400/20 bg-green-400/10 px-5 py-4 text-sm text-green-100">
          Your property lead has been submitted. Reference ID: {successId}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-[1.5rem] border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/50">
              Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputClassName}
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/50">
              Phone
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={inputClassName}
              placeholder="07XXXXXXXX"
              required
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/50">
              Property location
            </label>
            <input
              name="propertyLocation"
              value={formData.propertyLocation}
              onChange={handleChange}
              className={inputClassName}
              placeholder="Estate, town, county"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/50">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={inputClassName}
              placeholder="Expected price in KES"
              required
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/50">
              Plot size
            </label>
            <input
              name="plotSize"
              value={formData.plotSize}
              onChange={handleChange}
              className={inputClassName}
              placeholder="0.25 acres / 450 sqm"
            />
          </div>

          <div>
            <label className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/50">
              Bedrooms
            </label>
            <input
              type="number"
              min="0"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              className={inputClassName}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/50">
              Bathrooms
            </label>
            <input
              type="number"
              min="0"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              className={inputClassName}
              required
            />
          </div>
        </div>

        <ImageUploadField
          files={imageFiles}
          onFilesChange={setImageFiles}
          onError={setError}
          maxFiles={10}
          maxFileSizeMb={5}
          tone="dark"
          label="House Images"
          helperText="Upload clear house photos to help us review faster."
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3 text-sm text-white/58">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#d9b15f]" />
            <p>
              We review each lead before publishing. Quality submissions get faster follow-up and better buyer matching.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d9b15f] px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#111111] disabled:opacity-60"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Your Property Now'}
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/14 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white/82 transition-colors hover:border-[#d9b15f]/35 hover:text-[#f2dca3]"
            >
              <MessageCircleMore className="h-4 w-4" />
              Talk to Us on WhatsApp
            </a>
          </div>
        </div>
      </form>
    </div>
  )
}
