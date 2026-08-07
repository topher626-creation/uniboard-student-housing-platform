---
name: Academic Hearth
colors:
  surface: '#f9f9ff'
  surface-dim: '#cadaff'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e8edff'
  surface-container-high: '#e0e8ff'
  surface-container-highest: '#d7e2ff'
  on-surface: '#041b3c'
  on-surface-variant: '#434654'
  inverse-surface: '#1d3052'
  inverse-on-surface: '#edf0ff'
  outline: '#737685'
  outline-variant: '#c3c6d6'
  surface-tint: '#0c56d0'
  primary: '#003d9b'
  on-primary: '#ffffff'
  primary-container: '#0052cc'
  on-primary-container: '#c4d2ff'
  inverse-primary: '#b2c5ff'
  secondary: '#00687b'
  on-secondary: '#ffffff'
  secondary-container: '#50dcff'
  on-secondary-container: '#005f71'
  tertiary: '#7b2600'
  on-tertiary: '#ffffff'
  tertiary-container: '#a33500'
  on-tertiary-container: '#ffc6b2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b2c5ff'
  on-primary-fixed: '#001848'
  on-primary-fixed-variant: '#0040a2'
  secondary-fixed: '#afecff'
  secondary-fixed-dim: '#48d7f9'
  on-secondary-fixed: '#001f27'
  on-secondary-fixed-variant: '#004e5d'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59b'
  on-tertiary-fixed: '#380d00'
  on-tertiary-fixed-variant: '#812800'
  background: '#f9f9ff'
  on-background: '#041b3c'
  surface-variant: '#d7e2ff'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

The design system is engineered to bridge the gap between institutional reliability and the aspirational lifestyle of modern university students. It targets students in Kitwe, Zambia, seeking safe, high-quality off-campus housing. The aesthetic is **Corporate Modern with a Startup Polish**, utilizing heavy whitespace, crisp edges, and a "Premium Utility" feel reminiscent of leading global hospitality platforms.

The emotional goal is to evoke **Confidence** (through structure and blue tones) and **Accessibility** (through teal accents and soft roundedness). It avoids the clutter of traditional classified sites in favor of a curated, editorial experience that treats student housing as a lifestyle choice rather than a commodity.

## Colors

The palette is anchored by **Trust Blue**, providing the institutional weight necessary for financial transactions and lease agreements. **Student Teal** is used as a vibrant secondary accent for interactive elements, search filters, and progress indicators, keeping the UI feeling energetic.

The neutral scale is strictly high-contrast. Surface colors utilize a clean white (`#FFFFFF`) for primary cards and content areas, while the off-white background (`#F4F5F7`) provides a subtle separation for layout structure. Text is kept in a deep navy-charcoal to ensure maximum legibility and a premium, "ink-on-paper" feel.

## Typography

This design system utilizes **Inter** exclusively to achieve a systematic, utilitarian aesthetic that remains highly readable at small sizes. 

- **Headlines:** Use tight letter spacing and bold weights to create a strong visual hierarchy.
- **Body Text:** Uses a generous line height (1.5x) to ensure long descriptions of amenities and house rules are digestible.
- **Labels:** High-weight, smaller-size labels are used for metadata (e.g., "Distance to Campus," "Price per Semester").
- **Mobile Scaling:** Large display titles scale down aggressively on mobile to prevent awkward line breaks while maintaining their weight.

## Layout & Spacing

The layout follows a **Fluid-to-Fixed** hybrid model. For mobile devices, it uses a single-column layout with 16px side margins. On desktop, content is contained within a 1200px max-width container, centered on the screen to maintain a premium "magazine" feel.

The spacing rhythm is built on an **8px grid**. 
- **Internal Card Padding:** 24px for a spacious, luxury feel.
- **Section Spacing:** 64px to 80px to allow the "white space" to act as a separator.
- **Grid:** A 12-column grid for desktop, moving to a 2-column or 1-column grid for mobile listing views.

## Elevation & Depth

To achieve a "Startup-quality" feel, the design system avoids heavy shadows in favor of **Ambient, Tinted Depth**. 

- **Level 1 (Cards):** Very soft, diffused shadows with a slight blue tint (`rgba(23, 43, 77, 0.08)`) to lift property cards off the off-white background.
- **Level 2 (Modals/Dropdowns):** Deeper blur (24px) with less opacity to create a focus effect without feeling "heavy."
- **Tonal Layering:** Interactive states (hover) should not only change shadow depth but often lighten the background slightly to indicate "lift."

## Shapes

The shape language is defined by **Rounded (Level 2)** containers. 

- **Buttons & Inputs:** 8px (0.5rem) corner radius for a modern, friendly touch.
- **Property Images/Cards:** 16px (1rem) corner radius to soften the large visual elements and align with the Airbnb-inspired aesthetic.
- **Icon Enclosures:** Circular or highly rounded for a playful, student-focused look.

## Components

### Buttons
- **Primary:** Solid Trust Blue with white text. High contrast, 8px radius. 
- **Secondary:** Outlined Student Teal. Used for filters and secondary actions like "Message Landlord."
- **Tertiary:** Text-only with an icon, used for low-priority navigation.

### Property Cards
The core of the system. Large image aspect ratio (4:3), 16px corner radius, and absolute-positioned "Verified" badges using the Success Green. Price should be prominent in the bottom left using `headline-md`.

### Input Fields
Soft grey borders (`#D1D5DB`) that transition to Student Teal on focus. Labels sit outside the field in `label-md` bold for clarity.

### Chips & Badges
Small, pill-shaped indicators for amenities (e.g., "WiFi," "Power Backup," "Borehole"). Backgrounds should be low-opacity tints of the accent colors (e.g., 10% Teal background with 100% Teal text).

### Navigation
- **Mobile:** A persistent bottom navigation bar with icons for "Search," "Saved," and "Profile."
- **Desktop:** A clean top header with a prominent "List your Property" CTA in the Primary color.