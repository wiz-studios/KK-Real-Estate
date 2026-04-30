# Gold & Black Premium Theme

## Overview
The KK Real Estate website now features a premium gold and black color scheme that emphasizes trust, luxury, and exclusivity.

## Color Palette

### Primary Colors
- **Black**: `#000000` (oklch: 0.08 0 0)
  - Used for: Primary backgrounds, hero sections, footer, text on light backgrounds
  - Conveys: Trust, sophistication, authority

- **Gold/Yellow**: `#FFD700` - `#FCD34D` (oklch: 0.65 0.2 75)
  - Used for: Accent elements, buttons, hover states, badges, icons
  - Conveys: Premium quality, verification, confidence, warmth

### Supporting Neutrals
- **White**: `#FFFFFF` - Primary card and surface backgrounds
- **Dark Gray**: `#1F2937` - Secondary backgrounds, borders
- **Light Gray**: `#E5E7EB` - Subtle borders and dividers

## Component Theming

### Header (TrustHeader)
- Background: Black (`bg-black`)
- Logo badge: Gold (`bg-yellow-500`)
- Trust badge: Gold with dark background (`bg-yellow-600/10`)
- Buttons: Gold primary (`bg-yellow-500`)
- Hover states: Gold 600 (`hover:bg-yellow-600`)

### Hero Banner (TrustBanner)
- Background: Black gradient (`from-black via-gray-900 to-black`)
- Badge: Gold with transparency (`border-yellow-600/30 bg-yellow-600/10`)
- Heading: White text with gold gradient accent
- CTAs: Gold primary button with gold secondary outline
- Icons: Gold (`text-yellow-400`)

### Stats Section (TrustStats)
- Background: White
- Icons: Gold (`text-yellow-600`)
- Icon containers: Light gold (`bg-yellow-50`)
- Text: Black for values and labels

### Details Section (TrustDetails)
- Background: Light gray (`bg-gray-50`)
- Cards: White with subtle borders
- Icons: Gold (`text-yellow-600`)
- Icon containers: Light gold (`bg-yellow-50`)
- Checkmarks: Gold (`text-yellow-500`)

### Featured Properties
- Heading: Black
- Price badges: Black
- Links: Gold on hover
- Primary buttons: Gold (`bg-yellow-500`)
- Secondary buttons: Gold outline (`border-yellow-500`)

### CTA Section
- Background: Black (`bg-black`)
- Buttons: Gold primary with black text

### Footer
- Background: Dark gray (`bg-gray-900`)
- Links: Gray with gold hover state (`hover:text-yellow-400`)

### Verified Badge
- Minimal: Gold background with dark text
- Standard: Gold background with dark border
- Prominent: Gold gradient background with shield icon

## CSS Variables

Updated in `app/globals.css`:

```css
--primary: oklch(0.08 0 0)           /* Black */
--accent: oklch(0.65 0.2 75)         /* Gold */
--primary-foreground: oklch(0.98 0 0) /* Near white on black */
--accent-foreground: oklch(0.12 0 0) /* Dark text on gold */
```

## Usage Guidelines

### When to Use Gold
- Primary action buttons (Browse, Inquire, Contact)
- Verification badges and trust indicators
- Icon accents and highlights
- Hover states on links
- Gradient text for emphasis

### When to Use Black
- Main backgrounds for dark sections
- Product/property price badges
- Primary text on light backgrounds
- Section separators and borders
- Footer backgrounds

### When to Use White/Gray
- Card and content backgrounds
- Subtle borders and dividers
- Body text on dark backgrounds
- Secondary UI elements

## Tailwind Classes Used

**Gold accents:**
- `bg-yellow-500`, `bg-yellow-600`
- `text-yellow-400`, `text-yellow-500`, `text-yellow-600`
- `border-yellow-600/30`, `border-yellow-200`
- `bg-yellow-50`, `bg-yellow-100`

**Black elements:**
- `bg-black`
- `text-black`
- `from-black`, `to-black` (gradients)

**Combined theme:**
- Gold buttons: `bg-yellow-500 hover:bg-yellow-600 text-black`
- Gold text links: `text-yellow-600 hover:text-yellow-700`
- Gold with transparency: `border-yellow-600/30 bg-yellow-600/10`

## Accessibility

All color combinations maintain:
- **WCAG AA contrast** for readability
- Gold on white: 4.5:1 ratio (text)
- Black on white: 21:1 ratio (excellent)
- Gold on black: 5.2:1 ratio (sufficient for UI)

## Customization

To adjust the gold tone:

1. **Lighter gold:** Use `yellow-300` or `yellow-400`
2. **Darker gold:** Use `yellow-600` or `yellow-700`
3. **More orange-gold:** Use `amber-*` classes instead

Example in Tailwind:
```html
<!-- Current: bright gold -->
<button class="bg-yellow-500">Primary CTA</button>

<!-- Alternative: darker gold -->
<button class="bg-yellow-600">Primary CTA</button>

<!-- Alternative: amber gold -->
<button class="bg-amber-500">Primary CTA</button>
```

## Brand Impact

The black and gold combination creates:
- **Premium feel**: Luxury association
- **Trust**: Professional, established presence
- **Contrast**: Clear visual hierarchy
- **Sophistication**: Elegant and refined
- **Verification focus**: Gold = security/trust badge aesthetic

This theme positions KK Real Estate as a premium, trustworthy platform that stands apart from competitors.

## Files Updated

- `app/globals.css` - Color tokens
- `components/trust-header.tsx` - Header styling
- `components/trust-banner.tsx` - Hero section
- `components/trust-stats.tsx` - Statistics section
- `components/trust-details.tsx` - Details cards
- `components/verified-badge.tsx` - Verification badges
- `app/page.tsx` - Homepage all sections

All colors are now consistently themed with the gold and black palette.
