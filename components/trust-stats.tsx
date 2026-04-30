'use client';

import { TrendingUp, Users, Building2 } from 'lucide-react';

interface TrustStat {
  icon: React.ReactNode;
  value: string;
  label: string;
  description: string;
}

const stats: TrustStat[] = [
  {
    icon: <Building2 className="w-6 h-6" />,
    value: '500+',
    label: 'Verified Properties',
    description: 'All properties manually verified',
  },
  {
    icon: <Users className="w-6 h-6" />,
    value: '2,000+',
    label: 'Happy Transactions',
    description: 'Successful buyer-seller matches',
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    value: '0%',
    label: 'Fraud Rate',
    description: 'Zero scams reported',
  },
];

export function TrustStats() {
  return (
    <section className="w-full py-12 md:py-16 bg-white border-y border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-4 p-3 rounded-lg bg-yellow-50">
                <div className="text-yellow-600">{stat.icon}</div>
              </div>
              <div className="text-3xl md:text-4xl font-bold text-black mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-black mb-1">
                {stat.label}
              </div>
              <p className="text-sm text-gray-600">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
