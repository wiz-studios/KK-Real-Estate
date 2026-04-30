'use client';

import { Shield, CheckCircle2, Lock } from 'lucide-react';

export function TrustBanner() {
  return (
    <section className="relative w-full bg-gradient-to-b from-black via-gray-900 to-black py-16 md:py-24 overflow-hidden">
      {/* Decorative grid background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(217,119,6,.05)_1px,transparent_1px),linear-gradient(rgba(217,119,6,.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-600/30 bg-yellow-600/10 px-4 py-2">
            <Shield className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-yellow-400">Verified & Secured</span>
          </div>
        </div>

        {/* Main heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Only Verified Houses
          </h1>
          <p className="text-2xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-100 mb-6">
            No Scams, No Time Wasters
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Every property on KK Real Estate is manually verified by our team. We eliminate fraud, protect your time, and guarantee authentic listings you can trust.
          </p>
        </div>

        {/* Trust pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Pillar 1 */}
          <div className="relative p-6 rounded-lg border border-yellow-600/30 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
            <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-yellow-600/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">100% Verified</h3>
            <p className="text-gray-400 text-sm">
              Manual verification of every property listing with authentic documentation and owner confirmation.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="relative p-6 rounded-lg border border-yellow-600/30 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
            <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-yellow-600/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Fraud Prevention</h3>
            <p className="text-gray-400 text-sm">
              Advanced screening removes scams before they reach you. Your safety is our top priority.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="relative p-6 rounded-lg border border-yellow-600/30 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
            <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-yellow-600/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Serious Buyers Only</h3>
            <p className="text-gray-400 text-sm">
              We filter out time wasters and connect you with genuine, committed buyers and sellers.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-semibold transition-colors duration-300">
            Browse Verified Homes
          </button>
          <button className="px-8 py-3 rounded-lg border-2 border-yellow-600/30 hover:border-yellow-500/60 text-yellow-400 font-semibold transition-colors duration-300 bg-white/5 backdrop-blur-sm">
            List Your Property
          </button>
        </div>
      </div>
    </section>
  );
}
