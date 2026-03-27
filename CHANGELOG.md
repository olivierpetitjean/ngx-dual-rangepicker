# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-03-27

### Added

- `NgxDualRangepickerComponent` — inline or overlay date range picker
  - `[min]` / `[max]` date constraints
  - `[selectedRange]` / `(rangeSelected)` for two-way binding
  - `[position]` — smart overlay positioning (`auto`, `bottom-start`, `bottom-end`, `top-start`, `top-end`)
  - `[layout]` — `auto` (responsive), `horizontal`, or `vertical`
  - `[lockedMode]` — force a specific selection mode and hide the mode toggle
- `DualCalendarPanelComponent` — the standalone calendar panel
  - Dual-panel day picker with independent left / right month navigation
  - Month-range picker (`NgxMonthRangeViewComponent`)
  - Year-range picker (`NgxYearRangeViewComponent`)
  - Mode selector toggle (day / month / year)
  - Preset sidebar with 9 built-in presets (Today, Yesterday, This week, Last week, This month, Last month, This quarter, Last quarter, This year, Last year)
  - Optional time picker (`[enableTimePicker]`)
  - Hover-preview highlighting
  - Keyboard focus trap (`cdkTrapFocus`)
- `DualCalendarIntl` token for i18n label overrides
- Full Angular Material M3 theming via CSS custom properties
- 99 unit tests (Jasmine / Karma)
- Responsive layout: horizontal on wide viewports, vertical on narrow (`< 768 px`)
