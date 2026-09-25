---
name: Socio Impact Dashboard
colors:
  primary: "#0F172A"
  primary-foreground: "#F8FAFC"
  secondary: "#F1F5F9"
  secondary-foreground: "#0F172A"
  accent: "#10B981"
  accent-foreground: "#FFFFFF"
  neutral: "#FFFFFF"
  muted: "#64748B"
  muted-background: "#F8FAFC"
  border: "#E2E8F0"
  destructive: "#EF4444"
typography:
  fontFamily: "Instrument Sans, ui-sans-serif, system-ui, sans-serif"
  h1: { fontFamily: Instrument Sans, fontSize: 30px, fontWeight: 700, lineHeight: 1.2 }
  h2: { fontFamily: Instrument Sans, fontSize: 24px, fontWeight: 600, lineHeight: 1.25 }
  body-md: { fontFamily: Instrument Sans, fontSize: 14px, fontWeight: 400, lineHeight: 1.5 }
  body-sm: { fontFamily: Instrument Sans, fontSize: 12px, fontWeight: 400, lineHeight: 1.5 }
  label-md: { fontFamily: Instrument Sans, fontSize: 14px, fontWeight: 500, lineHeight: 1.4 }
rounded:
  sm: 4px
  md: 6px
  lg: 10px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
components:
  card:
    backgroundColor: "{colors.neutral}"
    rounded: "{rounded.lg}"
    border: "1px solid {colors.border}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
---

# Socio Impact Dashboard Design Specification

## Overview
A clean, high-density impact management and reimbursement platform built for clarity, operational efficiency, and rapid financial review.

## Colors
- **Primary (#0F172A):** Deep slate used for headings, primary brand actions, and high-emphasis elements.
- **Accent (#10B981):** Emerald green highlighting approvals, active date states, and positive outcomes.
- **Neutral (#FFFFFF / #F8FAFC):** Clean surfaces providing visual rest and crisp contrast.
- **Border (#E2E8F0):** Subtle dividers separating cards, tables, and controls.

## Typography
Instrument Sans across all headings and interface text, pairing high legibility with modern geometry.

## Layout
Responsive mobile-first grid and flex layouts. Mobile views feature dedicated quick actions and scrollable popovers/menus that adapt to viewport heights.

## Do's and Don'ts
- Do ensure all dropdown menus and modal filters have defined max heights with scrollable overflow on mobile screens.
- Do keep touch targets accessible (minimum 40x40px).
- Don't let vertical content get cut off outside mobile viewports.
