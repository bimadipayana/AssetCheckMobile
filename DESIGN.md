---
name: Operational Precision
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daea'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eefe'
  surface-container-high: '#e2e8f8'
  surface-container-highest: '#dce2f3'
  on-surface: '#151c27'
  on-surface-variant: '#444651'
  inverse-surface: '#2a313d'
  inverse-on-surface: '#ebf1ff'
  outline: '#757682'
  outline-variant: '#c5c5d3'
  surface-tint: '#4059aa'
  primary: '#00236f'
  on-primary: '#ffffff'
  primary-container: '#1e3a8a'
  on-primary-container: '#90a8ff'
  inverse-primary: '#b6c4ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#3e2400'
  on-tertiary: '#ffffff'
  tertiary-container: '#5c3800'
  on-tertiary-container: '#ef9900'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#00164e'
  on-primary-fixed-variant: '#264191'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f9f9ff'
  on-background: '#151c27'
  surface-variant: '#dce2f3'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  headline-md-mobile:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

The design system is engineered for high-stakes enterprise asset management, where clarity and speed of execution are paramount. The brand personality is **Professional, Reliable, and Utilitarian**, designed to fade into the background so the user's data can take center stage.

We utilize a **Corporate / Modern** design style characterized by:
- **Functional Minimalism:** Every element serves a purpose. Whitespace is used strategically to separate complex data sets rather than for purely aesthetic reasons.
- **High Information Density:** Optimized for expert users who need to process large amounts of asset data quickly.
- **Operational Clarity:** High-contrast status indicators and clear visual hierarchies ensure that users can identify discrepancies in stock levels at a glance.

## Colors

The palette is rooted in institutional reliability. The **Deep Blue** primary color establishes authority and trust. 

- **Primary (#1E3A8A):** Used for primary actions, navigation, and brand identification.
- **Semantic Colors:** Green (Success), Orange (Warning), and Red (Danger) are reserved strictly for asset status (e.g., Good Condition, Minor Damage, Missing).
- **Surface Colors:** We use a "Clean White" (#FFFFFF) for primary cards and content areas, while "Slate Gray" (#F9FAFB) is used for the application background to provide a subtle contrast that reduces eye strain during long auditing sessions.

## Typography

The design system utilizes **Inter** exclusively to ensure maximum legibility across both high-density desktop tables and mobile handheld scanners.

- **Scale:** The system uses a disciplined typographic scale. Body text defaults to 14px for data density, while 16px is used for instructional text.
- **Labels:** We use all-caps for `label-md` to denote metadata or table headers, providing a clear visual distinction from editable data.
- **Mobile:** On mobile devices, headline sizes are reduced to ensure long asset names do not wrap excessively, maintaining a compact vertical flow.

## Layout & Spacing

The design system employs a **4px baseline grid** to maintain strict alignment in data-heavy environments.

- **Desktop:** A 12-column fixed-width grid (max 1440px) is used for the management dashboard. Sidebars are fixed at 240px to maximize the horizontal space available for asset tables.
- **Mobile:** A fluid, single-column layout is used. Interactive elements like "Scan QR" buttons utilize the full width of the screen to ensure ease of use for field workers wearing gloves or moving quickly.
- **Density:** We prioritize "Compact" vertical spacing in lists and tables (8px to 12px) to minimize scrolling, while using "Wide" spacing (24px+) for form sections to prevent input errors.

## Elevation & Depth

To maintain a "Professional & Practical" aesthetic, we avoid heavy shadows and complex gradients.

- **Tonal Layers:** Depth is primarily communicated through background color shifts. Primary content sits on White (#FFFFFF) over a Light Gray (#F9FAFB) foundation.
- **Low-Contrast Outlines:** Instead of shadows, we use 1px borders (#E5E7EB) to define card boundaries and input fields. This keeps the UI feeling flat, fast, and precise.
- **Active Elevation:** Only the most critical interactive elements (like a floating "Scan" button on mobile) receive a subtle, small-radius ambient shadow to indicate they sit above the primary content plane.

## Shapes

The design system uses a **Soft (4px)** corner radius for almost all components. This slight rounding provides a modern feel without sacrificing the "industrial" and "efficient" look of the system.

- **Small Components:** Checkboxes and small tags use a 2px radius for a sharper, more precise appearance.
- **Buttons & Cards:** Follow the standard 4px radius. 
- **Icons:** Should be stroke-based (2px weight) with squared-off ends to match the structural integrity of the UI.

## Components

### Buttons
- **Primary:** Solid Deep Blue with white text. Height: 48px on mobile for touch-target compliance; 36px on desktop for density.
- **Secondary:** Outline Deep Blue or light gray ghost buttons for less critical actions like "Download Report."

### Data Tables
- Header rows use `label-md` with a light gray background (#F3F4F6).
- Vertical borders are removed; only horizontal hair-line dividers are used to lead the eye across the row.

### Status Badges
- Small, high-contrast pills. 
- **Good:** Green background (10% opacity) with Green text.
- **Missing:** Red background (10% opacity) with Red text.

### Input Fields
- Structured with a persistent 1px border.
- Active state uses a 1px Blue border with a 2px soft blue focus ring.
- Mobile inputs include integrated "Scan" icons for assets and locations.

### Asset Cards (Mobile)
- Used instead of tables on handheld devices. 
- Cards feature a large status indicator on the left edge and a prominent "Take Photo" or "Verify" action button at the bottom.