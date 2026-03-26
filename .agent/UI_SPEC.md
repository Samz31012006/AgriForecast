# UI Spec

## Product Surface
The MVP frontend is a mobile-first Next.js App Router application designed for farmers who need a short, clear flow from selection to recommendation.

## Layout Structure
- App Router root layout with shared header, content container, and safe mobile spacing
- dashboard page for input selection and recent context
- prediction view page for results, charts, and advisory

Suggested route shape:
- `/`
- `/prediction`

## Required Pages

### Dashboard
- primary entry page
- presents location and crop selection
- includes a clear CTA to run prediction
- optionally shows recent supported crops or market highlights

### Prediction View
- shows yield prediction
- shows mandi price forecast
- shows chart summaries
- shows advisory card with recommended action and risk notes
- includes source freshness and model metadata in a compact secondary section

## Required Components
- `LocationSelector`
  - state selector
  - district selector
  - crop selector
- `PredictionCard`
  - numeric output
  - confidence or label
  - contextual subtitle
- `PredictionCharts`
  - simple, readable trend chart for mandi forecast
  - compact comparison visuals only if they remain legible on mobile
- `AdvisoryCard`
  - recommendation headline
  - short summary
  - reasoning
  - risk notes

## shadcn/ui Usage
- use shadcn form controls for selectors and validation states
- use card components for prediction blocks and advisory
- use sheet or drawer patterns only when mobile interaction clearly benefits
- keep visual density low and tap targets large

## Mobile UX Rules
- optimize for one-handed use and poor connectivity conditions
- keep the primary CTA visible without excessive scrolling
- use short labels and plain language
- surface loading, stale-data, and fallback states clearly
- avoid heavy dashboards that overwhelm users with too many charts

## Content Rules
- Separate numeric predictions from AI advice visually.
- Use supportive language and plain English suitable for later localization.
- Highlight whether advice is based on fresh or cached market data.

## Maintenance Rule
- Update this file whenever routes, layouts, major components, or UX priorities change.
