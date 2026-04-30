'use client'

import Link from 'next/link'
import { Bath, Bed, Building2, MapPin, Sparkles } from 'lucide-react'
import { Property } from '@/lib/types'

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/properties/${property.id}`} className="group block h-full">
      <article className="soft-card h-full overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-[#d9b15f]/28 hover:bg-white/[0.05]">
        <div className="relative h-64 overflow-hidden">
          {property.images && property.images.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(217,177,95,0.18),_transparent_35%),linear-gradient(160deg,#1c1c1c,#0d0d0d)]">
              <Building2 className="h-14 w-14 text-[#d9b15f]/50" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-[#090909]/20 to-transparent" />

          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-[#d9b15f]/25 bg-[#090909]/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#efd89b]">
            <Sparkles className="h-3.5 w-3.5" />
            Verified
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-white/55">
                Asking
              </p>
              <p className="text-2xl font-semibold text-[#f4e4b7]">
                KES {property.price?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 p-5">
          <div className="space-y-3">
            <h3 className="font-display text-3xl leading-none text-white transition-colors group-hover:text-[#f4e4b7]">
              {property.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-white/62">
              <MapPin className="h-4 w-4 text-[#d9b15f]" />
              <span>
                {property.city}
                {property.county ? `, ${property.county}` : ''}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-[1.25rem] border border-white/8 bg-black/20 p-3 text-center">
            <div>
              <div className="mb-2 flex justify-center text-[#d9b15f]">
                <Bed className="h-4 w-4" />
              </div>
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-white/45">Beds</p>
              <p className="mt-1 text-base font-semibold text-white">{property.bedrooms}</p>
            </div>
            <div>
              <div className="mb-2 flex justify-center text-[#d9b15f]">
                <Bath className="h-4 w-4" />
              </div>
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-white/45">Baths</p>
              <p className="mt-1 text-base font-semibold text-white">{property.bathrooms}</p>
            </div>
            <div>
              <div className="mb-2 flex justify-center text-[#d9b15f]">
                <Building2 className="h-4 w-4" />
              </div>
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-white/45">Rooms</p>
              <p className="mt-1 text-base font-semibold text-white">{property.totalRooms}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-white/45">Type</p>
              <p className="mt-1 font-medium capitalize text-white/80">{property.propertyType}</p>
            </div>
            <span className="rounded-full border border-[#d9b15f]/18 bg-[#d9b15f]/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#efd89b]">
              Private tour
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
