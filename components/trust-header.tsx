'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowRight, Menu, ShieldCheck, X } from 'lucide-react'
import { Logo } from './logo'

const buyerNavLinks = [
  { href: '/properties', label: 'Properties' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/#experience', label: 'Why KK' },
  { href: '/#founder', label: 'Founder' },
]

const sellerNavLinks = [
  { href: '/submit-listing#how-it-works', label: 'How It Works' },
  { href: '/testimonials', label: 'Seller Results' },
  { href: '/submit-listing#owner-form', label: 'Submit Property' },
]

export function TrustHeader() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isSellerContext = pathname === '/submit-listing' || pathname === '/testimonials'
  const navLinks = isSellerContext ? sellerNavLinks : buyerNavLinks
  const badgeLabel = isSellerContext ? 'Seller listing desk' : 'Verified private listings'
  const desktopCta = isSellerContext
    ? { href: '/submit-listing#owner-form', label: 'Submit Property' }
    : { href: '/properties', label: 'Browse Properties' }
  const desktopSecondaryCta = isSellerContext
    ? { href: '/properties', label: 'Browse Properties' }
    : { href: '/submit-listing#owner-form', label: 'Submit Listing' }
  const mobileBarCta = isSellerContext
    ? { href: '/properties', label: 'Browse Properties' }
    : { href: '/submit-listing#owner-form', label: 'List Your Property' }

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#d9b15f]/14 bg-[#080808]/88 backdrop-blur-xl">
      <div className="section-shell">
        <div className="flex items-center justify-between gap-3 py-3 sm:h-20 sm:gap-4 sm:py-0">
          <Link href="/" className="min-w-0 flex-1">
            <div className="sm:hidden">
              <Logo size="sm" showText={false} className="min-w-0" />
            </div>
            <div className="hidden sm:block lg:hidden">
              <Logo size="sm" showText className="min-w-0" />
            </div>
            <div className="hidden lg:block">
              <Logo size="md" showText className="min-w-0" />
            </div>
          </Link>

          <div className="hidden items-center gap-3 lg:flex">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d9b15f]/24 bg-[#d9b15f]/10 px-4 py-2 text-sm font-medium text-[#f0d899]">
              <ShieldCheck className="h-4 w-4" />
              {badgeLabel}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
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
              href={desktopSecondaryCta.href}
              className="hidden items-center justify-center rounded-full border border-[#d9b15f]/24 bg-[#d9b15f]/10 px-4 py-2.5 text-sm font-semibold text-[#f0d899] transition-colors hover:border-[#d9b15f]/40 hover:text-white lg:inline-flex"
            >
              {desktopSecondaryCta.label}
            </Link>

            <Link
              href={desktopCta.href}
              className="hidden items-center gap-2 rounded-full bg-[#d9b15f] px-4 py-2.5 text-sm font-semibold text-[#111111] transition-transform duration-300 hover:-translate-y-0.5 md:inline-flex"
            >
              {desktopCta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>

            <button
              type="button"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-site-menu"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setIsMenuOpen((current) => !current)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-white transition-colors hover:border-[#d9b15f]/35 hover:text-[#f0d899] md:hidden"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="pb-3 md:hidden">
          <Link
            href={mobileBarCta.href}
            className="inline-flex w-full items-center justify-center rounded-full border border-[#d9b15f]/24 bg-[#d9b15f]/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#f0d899] transition-colors hover:border-[#d9b15f]/40 hover:text-white"
          >
            {mobileBarCta.label}
          </Link>
        </div>

        {isMenuOpen && (
          <div
            id="mobile-site-menu"
            className="border-t border-[#d9b15f]/10 py-4 md:hidden"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d9b15f]/24 bg-[#d9b15f]/10 px-4 py-2 text-sm font-medium text-[#f0d899]">
                <ShieldCheck className="h-4 w-4" />
                {badgeLabel}
              </div>

              <nav className="grid gap-2">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/78 transition-colors hover:border-[#d9b15f]/24 hover:text-[#f0d899]"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="grid gap-3">
                <Link
                  href="/properties"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d9b15f] px-4 py-3 text-sm font-semibold text-[#111111]"
                >
                  Browse Properties
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/submit-listing#owner-form"
                  className="inline-flex items-center justify-center rounded-full border border-white/12 px-4 py-3 text-sm font-semibold text-white/82 transition-colors hover:border-[#d9b15f]/35 hover:text-[#f2dca3]"
                >
                  {isSellerContext ? 'Submit Property' : 'List Your Property'}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
