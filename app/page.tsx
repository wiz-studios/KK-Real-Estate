'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CircleDollarSign,
  Compass,
  MapPin,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { Logo } from '@/components/logo'
import { TrustHeader } from '@/components/trust-header'

const featuredListings = [
  {
    title: 'Garden Residence in Karen',
    location: 'Karen, Nairobi',
    price: 'KSh 68M',
    note: 'Private gated estate with landscaped courtyards.',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'Skyline Apartment in Westlands',
    location: 'Westlands, Nairobi',
    price: 'KSh 31M',
    note: 'Turnkey city address with concierge-level service.',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'Signature Villa in Nyali',
    location: 'Nyali, Mombasa',
    price: 'KSh 85M',
    note: 'Coastal luxury curated for family and investor buyers.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80',
  },
]

const experienceCards = [
  {
    icon: ShieldCheck,
    title: 'Verified before you visit',
    copy: 'Each listing is screened physically, documented properly, and presented with fewer surprises.',
  },
  {
    icon: Compass,
    title: 'Curated for serious buyers',
    copy: 'We narrow the field to homes, apartments, and investment opportunities worth your time.',
  },
  {
    icon: CircleDollarSign,
    title: 'Premium advisory pace',
    copy: 'Pricing, location context, and viewing coordination are handled with discretion and speed.',
  },
]

const trustStats = [
  { value: '500+', label: 'Listings screened' },
  { value: '48hrs', label: 'Average verification cycle' },
  { value: '100%', label: 'Manual review commitment' },
]

export default function HomePage() {
  return (
    <>
      <TrustHeader />

      <main className="overflow-hidden">
        <section className="hero-grid relative border-b border-[#d9b15f]/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,177,95,0.16),transparent_28%),radial-gradient(circle_at_left,rgba(255,255,255,0.05),transparent_20%)]" />

          <div className="section-shell relative grid min-h-[calc(100vh-5rem)] items-center gap-12 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
            <div className="fade-up max-w-3xl space-y-8">
              <div className="eyebrow">
                <Sparkles className="h-3.5 w-3.5" />
                Kenya's premium verification-first property desk
              </div>

              <div className="space-y-6">
                <h1 className="font-display text-6xl leading-[0.9] text-white sm:text-7xl lg:text-[5.5rem]">
                  Verified homes for buyers who move with{' '}
                  <span className="gold-gradient-text">clarity.</span>
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-white/70 sm:text-xl">
                  KK Real Estate blends private-client presentation with on-ground verification,
                  so every viewing starts with better information and a stronger signal.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/properties"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d9b15f] px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#111111] transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Explore Listings
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="#founder"
                  className="inline-flex items-center justify-center rounded-full border border-white/14 px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white/82 transition-colors hover:border-[#d9b15f]/35 hover:text-[#f2dca3]"
                >
                  Meet the Founder
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {trustStats.map((item) => (
                  <div key={item.label} className="soft-card p-5">
                    <p className="font-display text-4xl text-[#f4e4b7]">{item.value}</p>
                    <p className="mt-2 text-sm uppercase tracking-[0.22em] text-white/50">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="fade-up lg:justify-self-end">
              <div className="surface-panel relative overflow-hidden p-5 sm:p-6">
                <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#d9b15f]/70 to-transparent" />
                <div className="grid gap-5">
                  <div className="rounded-[1.75rem] border border-white/10 bg-black/30 p-4">
                    <div className="relative overflow-hidden rounded-[1.45rem]">
                      <Image
                        src="/founder-profile.jpg"
                        alt="KK Real Estate founder"
                        width={720}
                        height={860}
                        className="h-[26rem] w-full object-cover object-top"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-transparent to-transparent" />
                      <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.28em] text-white/55">Founder vision</p>
                          <p className="font-display text-3xl text-white">Trust-driven brokerage</p>
                        </div>
                        <div className="rounded-full border border-[#d9b15f]/22 bg-[#d9b15f]/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#f1d89b]">
                          Since 2020
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
                    <div className="soft-card p-5">
                      <p className="text-xs uppercase tracking-[0.28em] text-white/45">Why clients stay</p>
                      <ul className="mt-4 space-y-4 text-sm leading-7 text-white/72">
                        <li className="flex items-start gap-3">
                          <BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-[#d9b15f]" />
                          Better pre-qualification before time is spent on site visits.
                        </li>
                        <li className="flex items-start gap-3">
                          <BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-[#d9b15f]" />
                          Cleaner listing presentation that feels closer to private banking than classifieds.
                        </li>
                        <li className="flex items-start gap-3">
                          <BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-[#d9b15f]" />
                          Higher confidence for diaspora and premium local buyers.
                        </li>
                      </ul>
                    </div>

                    <div className="soft-card flex flex-col justify-between p-5">
                      <Logo size="lg" showText={false} />
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.28em] text-white/45">Brand posture</p>
                        <p className="font-display text-3xl text-white">Calm luxury. Clear facts.</p>
                        <p className="text-sm leading-7 text-white/65">
                          The interface is designed to feel private, intentional, and investment-ready.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="experience" className="border-b border-white/6 py-20 lg:py-24">
          <div className="section-shell">
            <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="eyebrow">Client experience</div>
                <h2 className="mt-5 font-display text-5xl text-white sm:text-6xl">
                  A sharper property journey, without the marketplace noise.
                </h2>
              </div>
              <p className="max-w-xl text-base leading-8 text-white/68">
                The redesign keeps the premium black-and-gold identity, but upgrades spacing,
                typography, contrast, and hierarchy so the site feels more like a private advisory desk.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {experienceCards.map((card) => (
                <article key={card.title} className="surface-panel p-7">
                  <div className="mb-6 inline-flex rounded-2xl border border-[#d9b15f]/20 bg-[#d9b15f]/10 p-3 text-[#e7c77d]">
                    <card.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-4xl text-white">{card.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/68">{card.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-24">
          <div className="section-shell">
            <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="eyebrow">Featured preview</div>
                <h2 className="mt-5 font-display text-5xl text-white sm:text-6xl">
                  Signature listings with stronger first impressions.
                </h2>
              </div>
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#f0d899] transition-colors hover:text-white"
              >
                View all properties
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {featuredListings.map((listing) => (
                <article key={listing.title} className="surface-panel overflow-hidden">
                  <div className="relative h-56 overflow-hidden p-6">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,177,95,0.16),transparent_32%),linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.55))]" />
                    <div className="relative flex h-full items-end justify-between gap-5">
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-white/45">Featured</p>
                        <p className="mt-3 font-display text-4xl text-white">{listing.price}</p>
                      </div>
                      <div className="rounded-full border border-[#d9b15f]/20 bg-[#d9b15f]/10 p-3 text-[#e7c77d]">
                        <Building2 className="h-6 w-6" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 p-6">
                    <div>
                      <h3 className="font-display text-4xl text-white">{listing.title}</h3>
                      <div className="mt-3 flex items-center gap-2 text-sm text-white/58">
                        <MapPin className="h-4 w-4 text-[#d9b15f]" />
                        {listing.location}
                      </div>
                    </div>
                    <p className="text-sm leading-7 text-white/65">{listing.note}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="founder" className="border-y border-white/6 bg-[linear-gradient(180deg,#111111,#090909)] py-20 lg:py-24">
          <div className="section-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="surface-panel overflow-hidden p-4">
              <div className="overflow-hidden rounded-[1.7rem]">
                <Image
                  src="/founder-profile.jpg"
                  alt="KK Real Estate founder portrait"
                  width={820}
                  height={1040}
                  className="h-full w-full object-cover object-top"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="eyebrow">Founder narrative</div>
              <h2 className="font-display text-5xl text-white sm:text-6xl">
                Built to make premium property search feel trustworthy again.
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-white/68">
                KK Real Estate was founded around a practical observation: buyers are willing to move quickly
                when the listing quality, verification discipline, and communication standard are clearly higher.
              </p>
              <p className="max-w-2xl text-base leading-8 text-white/62">
                The updated experience leans into that position. It reduces clutter, strengthens confidence cues,
                and gives every screen a more intentional premium rhythm.
              </p>
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 rounded-full border border-[#d9b15f]/24 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#f0d899] transition-colors hover:bg-[#d9b15f]/10"
              >
                See available properties
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="section-shell">
            <div className="surface-panel flex flex-col gap-8 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-8">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-white/45">Ready to browse</p>
                <h2 className="mt-2 font-display text-4xl text-white sm:text-5xl">
                  Start with listings that already feel filtered.
                </h2>
              </div>
              <Link
                href="/properties"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d9b15f] px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#111111]"
              >
                Open property catalogue
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
