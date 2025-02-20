# PharmacyHub Assets Guidelines

This section provides comprehensive specifications and guidelines for managing images and other assets in the PharmacyHub application.

## Table of Contents

1. [Directory Structure](#directory-structure)
2. [Image Specifications](#image-specifications)
3. [Icon Guidelines](#icon-guidelines)
4. [Animation Guidelines](#animation-guidelines)
5. [Accessibility Requirements](#accessibility-requirements)
6. [Performance Optimization](#performance-optimization)
7. [Implementation Notes](#implementation-notes)

## Directory Structure

All assets are organized in a structured directory hierarchy:

```
/public/
├── Images/
│   ├── auth/          # Authentication-related images
│   ├── exams/         # Examination-related images
│   ├── licensing/     # Licensing-related images
│   ├── home/          # Homepage assets
│   ├── ui/            # UI component assets
│   └── logos/         # Logo assets
└── fonts/             # Typography assets
```

### 1. Authentication Section
**Directory**: `public/Images/auth/`

| Image Name | Format | Purpose | Specifications |
|------------|--------|---------|----------------|
| login-background.webp | WebP | Login page background | 1920x1080px |
| signup-background.webp | WebP | Signup page background | 1920x1080px |
| profile-placeholder.webp | WebP | Default user avatar | 256x256px |
| forgot-password-bg.webp | WebP | Password reset background | 1920x1080px |
| verification-success.webp | WebP | Email verification success | 512x512px |

### 2. Examination Section
**Directory**: `public/Images/exams/`

| Image Name | Format | Purpose | Specifications |
|------------|--------|---------|----------------|
| mcq-test-icon.webp | WebP | MCQ test identifier | 64x64px |
| past-paper-icon.webp | WebP | Past papers section | 64x64px |
| model-paper-icon.webp | WebP | Model papers indicator | 64x64px |
| exam-complete-badge.webp | WebP | Completion indicator | 128x128px |
| score-certificate.webp | WebP | Certificate template | 800x600px |
| study-materials-icon.webp | WebP | Study resources | 64x64px |

### 3. Licensing Section
**Directory**: `public/Images/licensing/`

| Image Name | Format | Purpose | Specifications |
|------------|--------|---------|----------------|
| license-certificate-template.webp | WebP | License certificate | 1000x700px |
| official-stamp.webp | WebP | Verification stamp | 256x256px |
| verification-badge.webp | WebP | Verified status | 128x128px |
| document-approved-icon.webp | WebP | Approval status | 64x64px |
| license-pending-icon.webp | WebP | Pending status | 64x64px |
| renewal-reminder-icon.webp | WebP | Renewal notification | 64x64px |

### 4. Home Section
**Directory**: `public/Images/home/`

| Image Name | Format | Purpose | Specifications |
|------------|--------|---------|----------------|
| hero-pharmacy-main.webp | WebP | Hero section main image | 2000x1000px |
| pharmacist-consulting.webp | WebP | Feature section | 800x600px |
| modern-pharmacy-interior.webp | WebP | About section | 1200x800px |
| team-pharmacists.webp | WebP | Team section | 1200x800px |
| testimonial-bg.webp | WebP | Testimonials background | 1920x300px |
| features-collage.webp | WebP | Features showcase | 1200x800px |

### 5. UI Components
**Directory**: `public/Images/ui/`

| Image Name | Format | Purpose | Specifications |
|------------|--------|---------|----------------|
| default-avatar.webp | WebP | Default user image | 256x256px |
| loading-spinner.svg | SVG | Loading indicator | Vector, animatable |
| success-check.svg | SVG | Success indicator | Vector, green theme |
| error-alert.svg | SVG | Error indicator | Vector, red theme |
| info-icon.svg | SVG | Information icon | Vector, blue theme |
| warning-icon.svg | SVG | Warning indicator | Vector, yellow theme |
| dropdown-arrow.svg | SVG | Dropdown indicator | Vector, simple design |
| menu-hamburger.svg | SVG | Mobile menu icon | Vector, 3 lines |
| close-icon.svg | SVG | Close/dismiss icon | Vector, X design |
| search-icon.svg | SVG | Search functionality | Vector, magnifying glass |

### 6. Logo Assets
**Directory**: `public/Images/logos/`

| Image Name | Format | Purpose | Specifications |
|------------|--------|---------|----------------|
| pharmacyhub-main.webp | WebP | Primary logo | 512x512px, full color |
| pharmacyhub-dark.webp | WebP | Dark theme logo | 512x512px, light colors |
| pharmacyhub-light.webp | WebP | Light theme logo | 512x512px, dark colors |
| favicon.ico | ICO | Browser favicon | 16x16px, 32x32px variants |
| app-icon-192.png | PNG | PWA icon small | 192x192px, app icon |
| app-icon-512.png | PNG | PWA icon large | 512x512px, app icon |

## Image Specifications

### General Requirements
- All photographic images should use WebP format for better compression
- Icons should use SVG format for scalability
- Images should be optimized for web delivery
- All images should maintain consistent style and branding
- Responsive image variants should be provided where needed

### Resolution Guidelines
- Photographs: Minimum 2x for retina displays
- Icons: Multiple sizes (24px, 36px, 48px)
- Logos: Multiple resolutions for different use cases
- Background images: Optimal resolution for target display size

### Format Selection Guidelines

| Content Type | Preferred Format | Fallback Format | Notes |
|--------------|------------------|-----------------|-------|
| Photographs | WebP | JPEG | Use progressive JPEG for fallback |
| Icons/UI elements | SVG | PNG | Use SVG whenever possible for scalability |
| Logos | SVG | PNG | Include PNG fallbacks for older browsers |
| Illustrations | SVG | PNG | Vector preferred for illustrations |
| Complex images | WebP | PNG | Use when transparency needed |
| Animations | SVG/CSS | GIF | Prefer CSS animations where possible |

## Icon Guidelines

### Icon Design Principles

1. **Consistency**: All icons should follow a consistent style:
   - 2px stroke weight for outlined icons
   - Rounded corners (2px radius)
   - Consistent padding within bounding box
   - Same color palette

2. **Sizing**: 
   - Base size: 24x24px
   - Touch targets: Minimum 44x44px
   - Optional larger variants: 36px, 48px

3. **Color**:
   - Use currentColor for SVG fill/stroke to inherit from text
   - Maintain sufficient contrast (minimum 3:1 ratio)
   - Support both light and dark themes

### Icon Implementation

Use icons as React components with the following pattern:

```tsx
// Example icon component
import { FC, SVGProps } from 'react';

export const SearchIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
```

## Animation Guidelines

### Animation Principles

1. **Purpose-driven**: Animations should:
   - Guide user attention
   - Provide feedback
   - Express brand personality
   - Improve perceived performance

2. **Performance**:
   - Animate only transform and opacity properties when possible
   - Use CSS animations for simple transitions
   - Use requestAnimationFrame for complex JS animations
   - Consider reducing motion for accessibility

3. **Timing**:
   - Quick feedback: 100-200ms
   - Standard transitions: 200-300ms
   - Expressive animations: 400-600ms
   - Never exceed 1000ms for UI animations

### Animation Implementation

```css
/* Example animation variables */
:root {
  --animation-speed-fast: 100ms;
  --animation-speed-normal: 250ms;
  --animation-speed-slow: 500ms;
  --animation-easing-standard: cubic-bezier(0.4, 0.0, 0.2, 1);
  --animation-easing-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1);
  --animation-easing-accelerate: cubic-bezier(0.4, 0.0, 1, 1);
}

/* Example button hover animation */
.button {
  transition: transform var(--animation-speed-fast) var(--animation-easing-standard),
              background-color var(--animation-speed-normal) var(--animation-easing-standard);
}

.button:hover {
  transform: translateY(-2px);
}
```

## Accessibility Requirements

### Image Accessibility

1. **Alt Text**:
   - All images must have appropriate alt text
   - Decorative images should use empty alt (`alt=""`)
   - Complex images should have detailed descriptions
   - Icons should have aria-label when used alone

2. **Color Contrast**:
   - All visual elements must maintain 4.5:1 contrast ratio
   - UI controls and graphics require 3:1 minimum contrast
   - Test all elements in both light and dark themes

3. **Motion Sensitivity**:
   - Respect `prefers-reduced-motion` media query
   - Provide non-animated alternatives
   - Avoid flashing content (3 flashes or below per second)

### Implementation Example

```tsx
// Accessible image component
const AccessibleImage = ({ src, alt, isDecorative, ...props }) => {
  return (
    <img 
      src={src} 
      alt={isDecorative ? "" : alt}
      aria-hidden={isDecorative}
      {...props}
    />
  );
};

// Respecting reduced motion
const MotionSafeAnimation = ({ children }) => {
  return (
    <div className="animate-fade-in motion-safe:animate-bounce">
      {children}
    </div>
  );
};
```

## Performance Optimization

### Image Optimization Guidelines

1. **Responsive Images**:
   - Use `<picture>` element with multiple sources
   - Provide WebP with fallbacks
   - Implement srcset for different viewport sizes
   - Use appropriate sizes attribute

2. **Lazy Loading**:
   - Implement native lazy loading (`loading="lazy"`)
   - Use intersection observer for custom implementations
   - Prioritize above-the-fold images

3. **Optimization Tools**:
   - Use Next.js Image component when possible
   - Implement automated image optimization in build pipeline
   - Target WebP format with quality 75-85
   - Strip metadata from production images

### Implementation Example

```tsx
// Next.js Image component usage
import Image from 'next/image';

const ResponsiveHero = () => {
  return (
    <Image
      src="/Images/home/hero-pharmacy-main.webp"
      alt="Modern pharmacy interior with pharmacist helping customer"
      width={2000}
      height={1000}
      priority={true}
      quality={85}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
    />
  );
};

// Fallback for custom elements
const ResponsiveImageFallback = ({ src, alt, ...props }) => {
  return (
    <picture>
      <source 
        srcSet={`${src}.webp`} 
        type="image/webp" 
      />
      <source 
        srcSet={`${src}.jpg`} 
        type="image/jpeg" 
      />
      <img 
        src={`${src}.jpg`} 
        alt={alt}
        loading="lazy"
        {...props}
      />
    </picture>
  );
};
```

## Implementation Notes

1. **Asset Management**
   - All new assets should be added to the appropriate directory
   - Assets should be optimized before committing to repository
   - Use descriptive, kebab-case filenames
   - Include image dimensions in filename when appropriate

2. **Version Control**
   - Store optimized assets in git repository
   - Use LFS for large binary files
   - Document significant asset changes in commit messages

3. **Build Pipeline**
   - Automate WebP conversion in build process
   - Generate responsive image sizes automatically
   - Include image hashes in filenames for cache busting

For detailed image specifications, see the [Image Requirements Guide](./image-requirements.md).
