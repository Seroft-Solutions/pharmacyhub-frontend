# PharmacyHub Image Requirements Documentation

## Directory Structure

### 1. Authentication Section
**Directory**: `public/Images/auth/`

| Image Name | Format | Purpose | Specifications |
|------------|--------|---------|----------------|
| login-background.webp | WebP | Login page background | 1920x1080px, subtle medical theme |
| signup-background.webp | WebP | Signup page background | 1920x1080px, professional pharmacy setting |
| profile-placeholder.webp | WebP | Default user avatar | 256x256px, neutral design |
| forgot-password-bg.webp | WebP | Password reset page background | 1920x1080px, minimal design |
| verification-success.webp | WebP | Email verification success | 512x512px, celebratory design |

### 2. Examination Section
**Directory**: `public/Images/exams/`

| Image Name | Format | Purpose | Specifications |
|------------|--------|---------|----------------|
| mcq-test-icon.webp | WebP | MCQ test identifier | 64x64px, clear test symbol |
| past-paper-icon.webp | WebP | Past papers section | 64x64px, document style |
| model-paper-icon.webp | WebP | Model papers indicator | 64x64px, paper with check mark |
| exam-complete-badge.webp | WebP | Completion indicator | 128x128px, achievement design |
| score-certificate.webp | WebP | Certificate template | 800x600px, professional certificate |
| study-materials-icon.webp | WebP | Study resources | 64x64px, book/study symbol |

### 3. Licensing Section
**Directory**: `public/Images/licensing/`

| Image Name | Format | Purpose | Specifications |
|------------|--------|---------|----------------|
| license-certificate-template.webp | WebP | License certificate | 1000x700px, official design |
| official-stamp.webp | WebP | Verification stamp | 256x256px, transparent background |
| verification-badge.webp | WebP | Verified status | 128x128px, trust indicator |
| document-approved-icon.webp | WebP | Approval status | 64x64px, check mark design |
| license-pending-icon.webp | WebP | Pending status | 64x64px, clock/waiting design |
| renewal-reminder-icon.webp | WebP | Renewal notification | 64x64px, alert design |

### 4. Home Section
**Directory**: `public/Images/home/`

| Image Name | Format | Purpose | Specifications |
|------------|--------|---------|----------------|
| hero-pharmacy-main.webp | WebP | Hero section main image | 2000x1000px, modern pharmacy |
| pharmacist-consulting.webp | WebP | Feature section | 800x600px, consultation scene |
| modern-pharmacy-interior.webp | WebP | About section | 1200x800px, interior view |
| team-pharmacists.webp | WebP | Team section | 1200x800px, professional team |
| testimonial-bg.webp | WebP | Testimonials background | 1920x300px, subtle pattern |
| features-collage.webp | WebP | Features showcase | 1200x800px, feature highlights |

### 5. UI Components
**Directory**: `public/Images/ui/`

| Image Name | Format | Purpose | Specifications |
|------------|--------|---------|----------------|
| default-avatar.webp | WebP | Default user image | 256x256px, neutral design |
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

### Accessibility Considerations
- Maintain sufficient color contrast ratios
- Provide alt text descriptions in implementation
- Ensure text overlays remain readable
- Consider color-blind friendly design

### Performance Optimization
- Compress all images appropriately
- Use lazy loading for non-critical images
- Implement responsive loading using srcset
- Cache-control headers for optimal delivery

## Implementation Notes

1. All images should be stored in their respective directories as outlined above
2. Use appropriate image optimization tools before deployment
3. Implement lazy loading for images below the fold
4. Ensure proper caching strategies are in place
5. Consider implementing a CDN for better delivery
6. Follow accessibility guidelines when implementing images in the UI

This documentation will help maintain consistent image usage throughout the PharmacyHub application while ensuring optimal performance and accessibility.
