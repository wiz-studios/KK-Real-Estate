'use client';

import { CheckCircle, Clock, FileCheck, Users } from 'lucide-react';

interface TrustDetail {
  icon: React.ReactNode;
  title: string;
  description: string;
  points: string[];
}

const details: TrustDetail[] = [
  {
    icon: <FileCheck className="w-8 h-8" />,
    title: 'Verification Process',
    description: 'Every property undergoes rigorous verification before listing.',
    points: [
      'Document authentication',
      'Owner identification',
      'Property ownership confirmation',
      'Photo verification',
    ],
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Serious Buyers & Sellers',
    description: 'We screen all participants to ensure genuine intentions.',
    points: [
      'Identity verification',
      'Phone number confirmation',
      'Genuine intent assessment',
      'Direct communication only',
    ],
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: 'Fast & Transparent',
    description: 'No hidden fees, no surprises. Complete transparency throughout.',
    points: [
      'Instant property notifications',
      'Real-time messaging',
      'Clear pricing breakdown',
      'Transparent communication',
    ],
  },
];

export function TrustDetails() {
  return (
    <section className="w-full py-16 md:py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Why KK Real Estate is Different
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We&apos;ve built a platform where trust isn&apos;t just promised—it&apos;s guaranteed through rigorous verification and transparent processes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {details.map((detail, index) => (
            <div
              key={index}
              className="p-8 rounded-xl bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="mb-4 inline-flex p-3 rounded-lg bg-yellow-50 text-yellow-600">
                {detail.icon}
              </div>
              <h3 className="text-2xl font-bold text-black mb-3">
                {detail.title}
              </h3>
              <p className="text-gray-600 mb-6">
                {detail.description}
              </p>
              <ul className="space-y-3">
                {detail.points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
