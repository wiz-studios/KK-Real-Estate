'use client'

import Link from 'next/link'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Logo } from './logo'

const navLinks = [
  { href: '/properties', label: 'Properties' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/submit-listing', label: 'Submit Listing' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#owner-form', label: 'Sell With Us' },
]

export function TrustHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#d9b15f]/14 bg-[#080808]/88 backdrop-blur-xl">
      <div className="section-shell">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link href="/" className="min-w-0">
            <Logo size="md" showText className="min-w-0" />
          </Link>

          <div className="hidden items-center gap-3 lg:flex">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d9b15f]/24 bg-[#d9b15f]/10 px-4 py-2 text-sm font-medium text-[#f0d899]">
              <ShieldCheck className="h-4 w-4" />
              Verified private listings
            </div>
          </div>

          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-6 md:flex">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-white/70 transition-colors hover:text-[#f0d899]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <Link
              href="/#owner-form"
              className="inline-flex items-center gap-2 rounded-full bg-[#d9b15f] px-4 py-2.5 text-sm font-semibold text-[#111111] transition-transform duration-300 hover:-translate-y-0.5"
            >
              List Your Property
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
