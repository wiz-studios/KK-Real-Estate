'use client'

import { useEffect, useState } from 'react'
import { Filter, Search } from 'lucide-react'
import { Property, PropertyType } from '@/lib/types'
import { PropertyCard } from '@/components/property-card'
import { TrustHeader } from '@/components/trust-header'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { mockProperties } from '@/lib/mock-properties'

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

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [city, setCity] = useState('')
  const [propertyType, setPropertyType] = useState<PropertyType | ''>('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [search, setSearch] = useState('')

  const fetchProperties = async (pageNum: number) => {
    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams()
      params.append('page', pageNum.toString())
      params.append('pageSize', '12')

      if (city) params.append('city', city)
      if (propertyType) params.append('propertyType', propertyType)
      if (minPrice) params.append('minPrice', minPrice)
      if (maxPrice) params.append('maxPrice', maxPrice)
      if (bedrooms) params.append('bedrooms', bedrooms)
      if (search) params.append('search', search)

      const response = await fetch(`/api/properties?${params}`)

      if (!response.ok) {
        throw new Error('Failed to fetch properties')
      }

      const { data, pagination } = await response.json()
      const hasActiveFilters =
        Boolean(city) ||
        Boolean(propertyType) ||
        Boolean(minPrice) ||
        Boolean(maxPrice) ||
        Boolean(bedrooms) ||
        Boolean(search)

      if (!hasActiveFilters && (!data || data.length === 0)) {
        setError(null)
        setProperties(mockProperties)
        setTotalPages(1)
        setPage(1)
        return
      }

      setProperties(data)
      setTotalPages(Math.max(1, pagination.totalPages))
      setPage(pageNum)
    } catch (err) {
      setError('Live listings are unavailable locally, so preview data is being shown.')
      setProperties(mockProperties)
      setTotalPages(1)
      setPage(1)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties(1)
  }, [])

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault()
    fetchProperties(1)
  }

  const inputClassName =
    'w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#d9b15f]/40 focus:outline-none'

  return (
    <>
      <TrustHeader />

      <main className="pb-20">
        <section className="border-b border-white/6">
          <div className="section-shell py-14 lg:py-18">
            <div className="max-w-3xl">
              <div className="eyebrow">Verified catalogue</div>
              <h1 className="mt-6 font-display text-5xl text-white sm:text-6xl lg:text-7xl">
                Browse refined listings across Kenya.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/68 sm:text-lg">
                Search through properties that are positioned with a cleaner premium experience,
                stronger filters, and verification-first trust cues.
              </p>
            </div>
          </div>
        </section>

        <section className="section-shell py-8 lg:py-10">
          <div className="surface-panel p-5 sm:p-6">
            <form onSubmit={handleSearch} className="space-y-5">
              <div className="grid gap-4 lg:grid-cols-[1.5fr_0.5fr]">
                <label className="relative block">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#d9b15f]/70" />
                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by title, city, county, or address"
                    className={`${inputClassName} pl-12`}
                  />
                </label>

                <button
                  type="submit"
                  className="rounded-2xl bg-[#d9b15f] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#111111] transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Search Listings
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <div>
                  <label className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/50">
                    City/Town
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    placeholder="Nairobi"
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/50">
                    Property Type
                  </label>
                  <Select
                    value={propertyType || 'all'}
                    onValueChange={(value) =>
                      setPropertyType(value === 'all' ? '' : (value as PropertyType))
                    }
                  >
                    <SelectTrigger
                      className="h-[50px] w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white shadow-none data-[placeholder]:text-white/35"
                    >
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border border-[#d9b15f]/20 bg-[#111111] text-white shadow-[0_24px_50px_rgba(0,0,0,0.55)]">
                      <SelectItem
                        value="all"
                        className="rounded-xl px-3 py-3 text-white focus:bg-[#d9b15f]/14 focus:text-[#f2dca3]"
                      >
                        All types
                      </SelectItem>
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

                <div>
                  <label className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/50">
                    Minimum Price
                  </label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(event) => setMinPrice(event.target.value)}
                    placeholder="0"
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/50">
                    Maximum Price
                  </label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(event.target.value)}
                    placeholder="Open"
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/50">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    value={bedrooms}
                    min="0"
                    onChange={(event) => setBedrooms(event.target.value)}
                    placeholder="Any"
                    className={inputClassName}
                  />
                </div>
              </div>
            </form>
          </div>
        </section>

        <section className="section-shell pt-4">
          {error && (
            <div className="mb-6 rounded-[1.5rem] border border-[#d9b15f]/16 bg-[#d9b15f]/10 px-5 py-4 text-sm text-[#f2deb0]">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="surface-panel py-20 text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#d9b15f]" />
              <p className="text-white/65">Loading curated properties...</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="surface-panel py-20 text-center">
              <Filter className="mx-auto mb-4 h-12 w-12 text-[#d9b15f]/65" />
              <p className="font-display text-4xl text-white">No properties match your criteria.</p>
              <p className="mt-3 text-sm text-white/55">Adjust the filters and search again.</p>
            </div>
          ) : (
            <>
              <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/45">
                    Catalogue results
                  </p>
                  <h2 className="mt-2 font-display text-4xl text-white">
                    {properties.length} premium property{properties.length === 1 ? '' : 'ies'} on this page
                  </h2>
                </div>
                <p className="text-sm text-white/48">
                  Page {page} of {totalPages}
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-10 flex flex-wrap justify-center gap-2">
                  {page > 1 && (
                    <button
                      onClick={() => fetchProperties(page - 1)}
                      className="rounded-full border border-white/12 px-5 py-2 text-sm font-medium text-white/78 transition-colors hover:border-[#d9b15f]/30 hover:text-[#f2dca3]"
                    >
                      Previous
                    </button>
                  )}

                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => fetchProperties(pageNumber)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                        pageNumber === page
                          ? 'bg-[#d9b15f] text-[#111111]'
                          : 'border border-white/12 text-white/78 hover:border-[#d9b15f]/30 hover:text-[#f2dca3]'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}

                  {page < totalPages && (
                    <button
                      onClick={() => fetchProperties(page + 1)}
                      className="rounded-full border border-white/12 px-5 py-2 text-sm font-medium text-white/78 transition-colors hover:border-[#d9b15f]/30 hover:text-[#f2dca3]"
                    >
                      Next
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </>
  )
}
