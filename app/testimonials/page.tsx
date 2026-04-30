import Link from 'next/link'
import { ArrowRight, Quote, ShieldCheck } from 'lucide-react'
import { TrustHeader } from '@/components/trust-header'
import { testimonials } from '@/lib/testimonials'

export default function TestimonialsPage() {
  return (
    <>
      <TrustHeader />

      <main className="pb-20">
        <section className="border-b border-white/6">
          <div className="section-shell py-14 lg:py-18">
            <div className="max-w-3xl">
              <div className="eyebrow">
                <ShieldCheck className="h-3.5 w-3.5" />
                Seller testimonials
              </div>
              <h1 className="mt-6 font-display text-4xl text-white sm:text-6xl lg:text-7xl">
                Owners who wanted faster, cleaner property sales.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/68 sm:text-lg">
                Five seller stories that reflect what the KK Real Estate process is designed to solve:
                wasted time, weak exposure, and unclear buyer quality.
              </p>
            </div>
          </div>
        </section>

        <section className="section-shell py-10 lg:py-14">
          <div className="grid gap-6 lg:grid-cols-2">
            {testimonials.map((testimonial) => (
              <article key={testimonial.name} className="surface-panel p-6 sm:p-7">
                <div className="mb-5 inline-flex rounded-2xl border border-[#d9b15f]/20 bg-[#d9b15f]/10 p-3 text-[#e7c77d]">
                  <Quote className="h-5 w-5" />
                </div>
                <p className="font-display text-3xl leading-tight text-white sm:text-4xl">
                  "{testimonial.quote}"
                </p>
                <div className="mt-6 rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f0d899]">
                    {testimonial.result}
                  </p>
                  <div className="mt-4 text-sm text-white/62">
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p>{testimonial.role}</p>
                    <p>{testimonial.location}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell pt-4">
          <div className="surface-panel flex flex-col gap-8 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-8">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/45">Next step</p>
              <h2 className="mt-2 font-display text-4xl text-white sm:text-5xl">
                Ready to put your house in front of serious buyers?
              </h2>
            </div>
            <Link
              href="/submit-listing#owner-form"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d9b15f] px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#111111]"
            >
              Submit Your Property
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
