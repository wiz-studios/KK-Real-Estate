'use client';

import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Shield } from 'lucide-react';

interface VerifiedBadgeProps {
  variant?: 'minimal' | 'standard' | 'prominent';
  className?: string;
}

export function VerifiedBadge({ variant = 'standard', className = '' }: VerifiedBadgeProps) {
  if (variant === 'minimal') {
    return (
      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 gap-1">
        <CheckCircle2 className="w-3 h-3" />
        Verified
      </Badge>
    );
  }

  if (variant === 'prominent') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-300 ${className}`}>
        <Shield className="w-4 h-4 text-yellow-700" />
        <span className="text-sm font-semibold text-yellow-900">Verified Property</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-50 border border-yellow-200 ${className}`}>
      <CheckCircle2 className="w-4 h-4 text-yellow-600" />
      <span className="text-sm font-semibold text-yellow-700">Verified Listing</span>
    </div>
  );
}
