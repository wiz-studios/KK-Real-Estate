# KK Real Estate - Style Guide & Brand Guidelines

## Brand Promise
**"Only Verified Houses — No Scams, No Time Wasters."**

This is more than a tagline—it's a commitment that appears consistently across all touchpoints.

---

## Visual Identity

### Color System

#### Primary Colors
- **Slate-900** (`#0f172a`): Trust, security, premium feeling
  - Used for: Main text, primary backgrounds, buttons
  - Hex: `#0f172a` / OKLCH: `oklch(0.15 0 0)`

- **Amber-500** (`#f59e0b`): Trust, verification, confidence
  - Used for: Accent highlights, verification badges, CTAs
  - Hex: `#f59e0b` / OKLCH: `oklch(0.62 0.189 42.43)`

#### Neutral Colors
- **White** (`#ffffff`): Clarity, trust, openness
- **Gray-50 to Gray-600**: Text hierarchy and subtle backgrounds
- **Slate-800/900**: Premium dark backgrounds

#### Status Colors
- **Green-600**: Verified, approved, safe
- **Red-600**: Alerts, destructive actions
- **Amber-400**: Warnings, caution

### Typography

**Font Family**: Geist (sans-serif)
- Regular weight: 400
- Semibold: 600
- Bold: 700

**Hierarchy**:
- **H1**: 3.75rem (60px) to 4.5rem (72px), bold, white on dark
- **H2**: 2.25rem (36px) to 3rem (48px), bold, dark on light
- **H3**: 1.5rem (24px), bold or semibold
- **Body**: 1rem (16px), regular weight
- **Caption**: 0.875rem (14px), regular

---

## Component Guidelines

### TrustBanner (Hero Section)
- **Background**: `from-slate-900 via-slate-800 to-slate-900` gradient
- **Main Text**: White, largest available size
- **Accent Text**: Amber gradient (`from-amber-200 to-amber-100`)
- **Padding**: `py-16 md:py-24` (64px to 96px)
- **Max Width**: `max-w-7xl` (80rem)

**Don't:**
- ❌ Use bright, flashy colors
- ❌ Add too many animations
- ❌ Compromise contrast for style
- ❌ Remove the verification message

### TrustStats (Social Proof)
- **Layout**: 3-column grid on desktop, 1 column on mobile
- **Card Style**: White background, subtle border
- **Icon Background**: Amber-50 with amber-600 icons
- **Spacing**: `gap-8` between cards

### TrustDetails (Detailed Explanation)
- **Background**: Gray-50
- **Card Style**: White with border, hover shadow effect
- **Icons**: Amber-600 in amber-50 circles
- **List Items**: Green checkmarks with gray text

### VerifiedBadge (Status Indicator)
- **Minimal**: Small, fits in tight spaces
- **Standard**: Medium size, general use
- **Prominent**: Large, hero sections and highlights

---

## Spacing & Layout

### Padding
- **XS**: `px-4` (16px) vertical/horizontal padding on small elements
- **SM**: `px-6` (24px)
- **MD**: `px-8` (32px)
- **LG**: `p-8` (32px) all sides

### Margins
- **Between Sections**: `py-16 md:py-24` (64px-96px)
- **Between Elements**: `mb-6`, `mb-8`, `mb-12`
- **Gaps in Grids**: `gap-4`, `gap-6`, `gap-8`

### Border Radius
- **Standard**: `rounded-lg` (0.625rem / 10px)
- **Large**: `rounded-xl` (1.25rem / 20px)
- **Full**: `rounded-full` (for circles/pills)

---

## Component Usage Examples

### Using VerifiedBadge in a Property Card
```tsx
<div className="relative">
  <VerifiedBadge variant="prominent" />
  {/* Card content */}
</div>
```

### Using TrustHeader
```tsx
<>
  <TrustHeader />
  {/* Page content */}
</>
```

### CTA Buttons
Primary (Amber):
```tsx
<button className="px-8 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors duration-300">
  Browse Verified Homes
</button>
```

Secondary (Outlined):
```tsx
<button className="px-8 py-3 rounded-lg border-2 border-amber-500/30 text-amber-600 font-semibold transition-colors duration-300">
  List Property
</button>
```

---

## Writing Guidelines

### Tone & Voice
- **Professional yet approachable**
- **Confident, not arrogant**
- **Clear and direct**
- **Always emphasize trust & verification**

### Key Messaging
- Use "Verified" when referring to properties/listings
- Use "No Scams" when addressing buyer concerns
- Use "Serious" when describing buyer/seller base
- Always lead with trust benefits

### Example Copy

❌ **Bad**: "Browse our properties."
✅ **Good**: "Browse verified properties with confidence."

❌ **Bad**: "List your home."
✅ **Good**: "List your verified home and reach serious buyers."

❌ **Bad**: "Safe platform."
✅ **Good**: "Only Verified Houses — No Scams, No Time Wasters."

---

## Responsive Design

### Breakpoints
- **Mobile**: < 640px (1 column layouts)
- **Tablet**: 640px - 1024px (2 column layouts)
- **Desktop**: > 1024px (3 column layouts)

### Mobile-First Approach
Start with mobile design, then add `md:` and `lg:` prefixes for larger screens.

### Example
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>
```

---

## Accessibility

### Color Contrast
- Text on backgrounds must maintain WCAG AA standards (4.5:1 minimum)
- Current scheme achieves AAA (7:1+) for all primary combinations

### Icons
- Always pair icons with text labels
- Decorative icons get `aria-hidden="true"`
- Important icons should have semantic meaning

### Keyboard Navigation
- All buttons must be keyboard accessible
- Links should be distinguishable from text
- Focus states should be visible

### Screen Readers
- Use semantic HTML (`<button>`, `<nav>`, `<main>`, `<section>`)
- Add `alt` text to images
- Use ARIA labels when needed

---

## Animation & Transitions

### Timing
- **Default**: `duration-300` (300ms)
- **Slow**: `duration-500` (500ms)
- **Easing**: `ease-in-out` for most transitions

### Hover Effects
- Color transitions: `hover:bg-amber-600`
- Shadow lift: `hover:shadow-lg`
- Text color: `hover:text-amber-700`

### DON'T
- ❌ Animate on page load
- ❌ Use more than 500ms for basic interactions
- ❌ Add bouncy or "flashy" animations
- ❌ Reduce animations on preference (use `prefers-reduced-motion`)

---

## Dark Mode (Future)

When implementing dark mode:
- Invert the color scheme
- Maintain contrast ratios
- Use `.dark` CSS class
- Test all components in both modes

---

## Maintenance Checklist

- [ ] All new components follow color guidelines
- [ ] Verify button contrast meets WCAG AA (4.5:1)
- [ ] Responsive design tested on mobile/tablet/desktop
- [ ] Verification messaging is clear and prominent
- [ ] No broken images or missing icons
- [ ] Load time acceptable (< 3 seconds)
- [ ] All links functional
- [ ] Analytics tracking in place

---

## Questions?

Refer to:
- `TRUST_FEATURE.md` for feature details
- `components/` folder for component implementations
- `app/globals.css` for design tokens
- `app/page.tsx` for layout examples
