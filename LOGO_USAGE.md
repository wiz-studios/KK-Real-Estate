# Logo Component & Usage Guide

## Overview
The KK Real Estate logo has been integrated throughout the site as a professional profile image with a gold border. The logo component is reusable across all pages and sections.

## Logo File
- **Location**: `/public/logo.jpg`
- **Format**: JPEG
- **Display**: Circular with gold border (2px)
- **Used in**: Header, Footer, and any custom sections

## Logo Component (`components/logo.tsx`)

### Usage
```tsx
import { Logo } from '@/components/logo';

// Default (medium size with text)
<Logo />

// Small (header use)
<Logo size="sm" showText={true} />

// Large (hero or featured sections)
<Logo size="lg" showText={false} />

// Custom styling
<Logo size="md" showText={true} className="mb-4" />
```

### Props
| Prop | Type | Options | Default | Description |
|------|------|---------|---------|-------------|
| `size` | string | `'sm'` \| `'md'` \| `'lg'` | `'md'` | Predefined size: Small (32px), Medium (40px), Large (64px) |
| `showText` | boolean | `true` \| `false` | `true` | Display "KK Real Estate" branding text below image |
| `className` | string | any Tailwind class | `''` | Additional CSS classes for positioning/spacing |

## Size Options

### Small (sm)
- Image: 32px × 32px
- Use case: Minimal headers, compact navigation
- With text: "KK Real Estate" appears at `text-sm`

### Medium (md)
- Image: 40px × 40px
- Use case: Main header, standard sections
- With text: "KK Real Estate" appears at `text-lg`

### Large (lg)
- Image: 64px × 64px
- Use case: Hero sections, feature highlights
- With text: "KK Real Estate" appears at `text-2xl`

## Current Implementations

### 1. Header (`components/trust-header.tsx`)
```tsx
<Logo size="md" showText={true} />
```
- Sticky navigation logo
- Gold border, circular crop
- Responsive on all devices

### 2. Footer (`app/page.tsx`)
```tsx
<Logo size="md" showText={true} className="mb-4" />
```
- Footer branding section
- Positioned above company tagline
- Same styling as header for consistency

## Styling Details

### Border
- **Style**: 2px solid gold (`border-yellow-500`)
- **Shape**: `rounded-full` (perfect circle)
- **Ensures**: Professional, premium appearance

### Text (when showText={true})
- **Color**: White for brand name, Yellow-400 for tagline
- **Font**: Bold for "KK Real Estate", Semibold for "Verified Properties"
- **Size**: Scales with size prop

## Image Requirements
The logo image should:
- Be a high-quality portrait/headshot
- Have good contrast for visibility
- Be square or easily croppable to square format
- Work well in circular crop (center-focused content)

## Replacing the Logo
To update the logo image:
1. Replace `/public/logo.jpg` with new image
2. Component automatically uses updated image
3. No code changes needed

## Brand Consistency
The logo component maintains consistency by:
- Using the same gold border color (`border-yellow-500`) throughout
- Consistent spacing and padding in all implementations
- Matching text styling (white + yellow) across pages
- Responsive sizing that scales appropriately

## Accessibility
- All logo images include `alt="KK Real Estate Logo"` for screen readers
- Text portions are properly labeled
- Sufficient contrast between logo and backgrounds
- Circular crop maintains image aspect ratio nicely

## Future Enhancements
Consider adding:
- Logo animation on hover (slight scale up)
- Logo tooltip on desktop
- Different logo variants for dark/light backgrounds
- SVG version for better scalability
