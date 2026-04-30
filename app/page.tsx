'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  Clock3,
  MapPinned,
  MessageCircleMore,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Upload,
  UserCheck,
} from 'lucide-react'
import { TrustHeader } from '@/components/trust-header'
import { OwnerLeadForm } from '@/components/owner-lead-form'
import { testimonials } from '@/lib/testimonials'

const WHATSAPP_URL =
  'https://wa.me/254700000000?text=Hello%20KK%20Real%20Estate%2C%20I%20want%20help%20selling%20my%20house.'

const painPoints = [
  'Too many unserious buyers wasting your time',
  'Your property not getting enough visibility',
  'No professional marketing or exposure',
  'Long delays with no clear progress',
]

const solutionPoints = [
  {
    icon: Camera,
    title: 'Professional property listings',
    copy: 'We position your already-built house with better images, better presentation, and a stronger first impression.',
  },
  {
    icon: UserCheck,
    title: 'Exposure to real, active buyers',
    copy: 'Your listing reaches a screened buyer network instead of getting buried among low-intent inquiries.',
  },
  {
    icon: PhoneCall,
    title: 'Fast response and viewing coordination',
    copy: 'We coordinate follow-up, answer buyer questions, and keep viewings moving without extra friction.',
  },
  {
    icon: MapPinned,
    title: 'Local market expertise',
    copy: 'Pricing context, buyer expectations, and area-specific positioning are handled with local market awareness.',
  },
]

const processSteps = [
  {
    icon: Upload,
    title: 'Submit your property details',
    copy: 'Share your location, price, room count, and photos through a short listing form.',
  },
  {
    icon: ShieldCheck,
    title: 'We review and publish your listing',
    copy: 'Our team checks the details, positions the property properly, and prepares it for serious buyer attention.',
  },
  {
    icon: BadgeCheck,
    title: 'We bring verified buyers and book viewings',
    copy: 'Qualified buyer interest is handled with faster feedback and structured viewing coordination.',
  },
]

const trustSignals = [
  'Verified Listings Only',
  'Serious Buyer Network',
  'Fast Turnaround',
]

export default function HomePage() {
  const [showStickyCta, setShowStickyCta] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setShowStickyCta(window.scrollY > 420)
    }

    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <TrustHeader />

      <main className="overflow-hidden pb-28">
        <section className="hero-grid relative border-b border-[#d9b15f]/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,177,95,0.16),transparent_28%),radial-gradient(circle_at_left,rgba(255,255,255,0.05),transparent_20%)]" />

          <div className="section-shell relative grid min-h-[calc(100vh-5rem)] items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-22">
            <div className="fade-up max-w-3xl space-y-8">
              <div className="eyebrow">
                <Sparkles className="h-3.5 w-3.5" />
                Seller-focused listing desk
              </div>

              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#d9b15f]/24 bg-[#d9b15f]/10 px-4 py-2 text-sm font-medium text-[#f0d899]">
                  <BadgeCheck className="h-4 w-4" />
                  Verified Buyers Only
                </div>
                <h1 className="font-display text-6xl leading-[0.9] text-white sm:text-7xl lg:text-[5.4rem]">
                  Sell Your House Faster
                  {' '}
                  <span className="gold-gradient-text">Without the Stress</span>
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-white/70 sm:text-xl">
                  We connect you with serious buyers, handle the marketing, and help you close faster.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="#owner-form"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d9b15f] px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#111111] transition-transform duration-300 hover:-translate-y-0.5"
                >
                  List Your Property
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="#owner-form"
                  className="inline-flex items-center justify-center rounded-full border border-white/14 px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white/82 transition-colors hover:border-[#d9b15f]/35 hover:text-[#f2dca3]"
                >
                  Get a Free Property Review
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="soft-card p-5">
                  <p className="font-display text-4xl text-[#f4e4b7]">Serious</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.22em] text-white/50">Buyer screening first</p>
                </div>
                <div className="soft-card p-5">
                  <p className="font-display text-4xl text-[#f4e4b7]">Fast</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.22em] text-white/50">Viewing coordination</p>
                </div>
                <div className="soft-card p-5">
                  <p className="font-display text-4xl text-[#f4e4b7]">Local</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.22em] text-white/50">Market positioning</p>
                </div>
              </div>
            </div>

            <div className="fade-up lg:justify-self-end">
              <div className="surface-panel relative overflow-hidden p-5 sm:p-6">
                <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#d9b15f]/70 to-transparent" />
                <div className="grid gap-5">
                  <div className="rounded-[1.75rem] border border-white/10 bg-black/30 p-5">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/45">Why sellers move to KK</p>
                    <div className="mt-5 grid gap-4">
                      {painPoints.slice(0, 3).map((point) => (
                        <div key={point} className="soft-card p-4">
                          <p className="text-sm leading-7 text-white/72">{point}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-[1fr_0.92fr]">
                    <div className="soft-card p-5">
                      <p className="text-xs uppercase tracking-[0.28em] text-white/45">Recent owner result</p>
                      <p className="mt-4 font-display text-3xl text-white">
                        “Got a serious buyer in days.”
                      </p>
                      <p className="mt-3 text-sm leading-7 text-white/62">
                        Seller response improves when the property is marketed clearly and buyer traffic is filtered better.
                      </p>
                    </div>

                    <div className="soft-card flex flex-col justify-between p-5">
                      <div className="inline-flex w-max items-center gap-2 rounded-full border border-[#d9b15f]/20 bg-[#d9b15f]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#f1d89b]">
                        <Clock3 className="h-3.5 w-3.5" />
                        Limited listing slots per area
                      </div>
                      <div className="space-y-2">
                        <p className="font-display text-3xl text-white">Quality over volume.</p>
                        <p className="text-sm leading-7 text-white/65">
                          We focus on quality listings to ensure faster sales and stronger buyer attention.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/6 py-20 lg:py-24">
          <div className="section-shell">
            <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="eyebrow">Seller pain points</div>
                <h2 className="mt-5 font-display text-5xl text-white sm:text-6xl">
                  Struggling to sell your house?
                </h2>
              </div>
              <p className="max-w-xl text-base leading-8 text-white/68">
                Most delays are not caused by the house alone. They come from weak presentation, poor exposure,
                and too much time lost on the wrong buyers.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {painPoints.map((painPoint, index) => (
                <article key={painPoint} className="surface-panel p-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/45">Pain point {index + 1}</p>
                  <p className="mt-4 font-display text-3xl text-white">{painPoint}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-24">
          <div className="section-shell">
            <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="eyebrow">Solution</div>
                <h2 className="mt-5 font-display text-5xl text-white sm:text-6xl">
                  Here’s how we help you sell faster.
                </h2>
              </div>
              <p className="max-w-xl text-base leading-8 text-white/68">
                The model is simple: position the property properly, attract active buyer demand, and keep the process moving.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {solutionPoints.map((point) => (
                <article key={point.title} className="surface-panel p-7">
                  <div className="mb-6 inline-flex rounded-2xl border border-[#d9b15f]/20 bg-[#d9b15f]/10 p-3 text-[#e7c77d]">
                    <point.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-4xl text-white">{point.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/68">{point.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-y border-white/6 bg-[linear-gradient(180deg,#111111,#090909)] py-20 lg:py-24">
          <div className="section-shell">
            <div className="max-w-2xl">
              <div className="eyebrow">How it works</div>
              <h2 className="mt-5 font-display text-5xl text-white sm:text-6xl">
                A simple three-step listing process.
              </h2>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {processSteps.map((step, index) => (
                <article key={step.title} className="surface-panel p-7">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="inline-flex rounded-2xl border border-[#d9b15f]/20 bg-[#d9b15f]/10 p-3 text-[#e7c77d]">
                      <step.icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.26em] text-[#f0d899]">
                      Step {index + 1}
                    </span>
                  </div>
                  <h3 className="font-display text-4xl text-white">{step.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/68">{step.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-24">
          <div className="section-shell">
            <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="eyebrow">Trust and authority</div>
                <h2 className="mt-5 font-display text-5xl text-white sm:text-6xl">
                  A premium process that still stays practical.
                </h2>
              </div>
              <p className="max-w-xl text-base leading-8 text-white/68">
                The goal is not to look flashy. It is to create confidence quickly and make buyer conversations more productive.
              </p>
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
              <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
                {trustSignals.map((signal) => (
                  <div key={signal} className="soft-card p-5">
                    <p className="text-xs uppercase tracking-[0.26em] text-white/45">Trust signal</p>
                    <p className="mt-3 font-display text-3xl text-white">{signal}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {testimonials.slice(0, 2).map((testimonial) => (
                  <article key={testimonial.name} className="surface-panel p-6">
                    <p className="text-xs uppercase tracking-[0.26em] text-[#f0d899]">{testimonial.result}</p>
                    <p className="mt-4 font-display text-4xl text-white">
                      “{testimonial.quote}”
                    </p>
                    <div className="mt-5 text-sm text-white/58">
                      <p className="font-semibold text-white">{testimonial.name}</p>
                      <p>{testimonial.role}</p>
                      <p>{testimonial.location}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/testimonials"
                className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#f0d899] transition-colors hover:text-white"
              >
                Read all testimonials
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="border-y border-white/6 py-18">
          <div className="section-shell">
            <div className="surface-panel px-6 py-8 md:px-8">
              <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                <div>
                  <div className="eyebrow">Scarcity</div>
                  <h2 className="mt-5 font-display text-5xl text-white sm:text-6xl">
                    Limited listing slots per area.
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-8 text-white/68">
                    We focus on quality listings to ensure faster sales. That means we limit how many similar houses we actively push within the same area at a time.
                  </p>
                </div>

                <div className="soft-card p-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/45">Why it matters</p>
                  <ul className="mt-4 space-y-4 text-sm leading-7 text-white/72">
                    <li className="flex items-start gap-3">
                      <BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-[#d9b15f]" />
                      Cleaner attention on each listing instead of volume overload.
                    </li>
                    <li className="flex items-start gap-3">
                      <BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-[#d9b15f]" />
                      Better follow-up quality with fewer weak leads.
                    </li>
                    <li className="flex items-start gap-3">
                      <BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-[#d9b15f]" />
                      Stronger control over presentation and buyer experience.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell py-16">
          <div className="surface-panel flex flex-col gap-8 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-8">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/45">Strong CTA</p>
              <h2 className="mt-2 font-display text-4xl text-white sm:text-5xl">
                Ready to sell your property faster?
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="#owner-form"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d9b15f] px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#111111]"
              >
                Submit Your Property Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/14 px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white/82 transition-colors hover:border-[#d9b15f]/35 hover:text-[#f2dca3]"
              >
                <MessageCircleMore className="h-4 w-4" />
                Talk to Us on WhatsApp
              </a>
            </div>
          </div>
        </section>

        <section id="owner-form" className="section-shell py-4">
          <div className="mb-10 max-w-3xl">
            <div className="eyebrow">Lead capture</div>
            <h2 className="mt-5 font-display text-5xl text-white sm:text-6xl">
              Submit your house details.
            </h2>
            <p className="mt-4 text-base leading-8 text-white/68">
              Keep it simple. Share the essentials and we will review the house for listing.
            </p>
          </div>

          <OwnerLeadForm />
        </section>
      </main>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-3 rounded-full border border-[#25D366]/20 bg-[#25D366] px-5 py-3 text-sm font-semibold text-[#08150c] shadow-[0_18px_45px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:-translate-y-0.5"
      >
        <MessageCircleMore className="h-4 w-4" />
        WhatsApp
      </a>

      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-[#d9b15f]/12 bg-[#080808]/94 px-4 py-3 backdrop-blur-xl transition-transform duration-300 md:px-6 ${
          showStickyCta ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-white/45">Ready to list?</p>
            <p className="text-sm text-white/72">Reach serious buyers faster with a stronger listing process.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="#owner-form"
              className="inline-flex items-center justify-center rounded-full bg-[#d9b15f] px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#111111]"
            >
              List Your Property
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/14 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white/82"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
