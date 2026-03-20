# Makrine Project Structure Guide

This document explains the folder architecture and responsibilities for this React project.  
Please follow these conventions when adding new code.

## Top-level layout

```txt
src/
  app/
  pages/
  components/
  features/
  hooks/
  services/
  utils/
  constants/
  assets/
  styles/
```

---

## 1) `app/` (application shell)

**Purpose**
- Contains app bootstrap, global providers, and application composition.
- Should not contain page-specific business implementation.

**Current content**
- `app/main.jsx`: app entry point.
- `app/App.jsx`: app shell component.
- `app/providers/theme/*`: theme system (ThemeProvider + themeManager).
- `app/providers/typography/*`: typography system (FontProvider + fontManager + Google Fonts loader).

**Guidance**
- New global capabilities (i18n, auth, error boundary, analytics) should go under `app/providers/<domain>/`.

---

## 2) `pages/` (page layer)

**Purpose**
- Route-level containers that compose a page.
- Page-specific state and layout should live here.

**Current content**
- `pages/Home/index.jsx`
- `pages/Home/Home.css`

**Guidance**
- Use one folder per page: `pages/<PageName>/`.
- Put page-private components in `pages/<PageName>/components/`.

---

## 3) `components/` (shared component layer)

**Purpose**
- Reusable components shared across multiple pages/features.

**Suggested grouping**
- `components/ui/`: base UI blocks (Button, Card, Modal, Input, etc.).
- `components/business/`: cross-page domain components.

**Rule of thumb**
- If a component is only used by one page, keep it inside that page first.
- Promote it to `components/` once it is reused by another page.

---

## 4) `features/` (feature/domain layer, optional)

**Purpose**
- Organizes code by business capability for medium/large scale projects.

**Example folders**
- `features/profile/`
- `features/dashboard/`
- `features/theme/` (if theme logic grows beyond provider-level concerns)

**Typical subfolders**
- `components/`, `hooks/`, `services/`, `api/`, `store/` (as needed).

---

## 5) `hooks/` (global reusable hooks)

**Purpose**
- Shared hooks that are not tightly coupled to a single page.

**Examples**
- `useDebounce`, `useLocalStorage`, `useMediaQuery`.

---

## 6) `services/` (service layer)

**Purpose**
- External integrations and API abstraction.
- HTTP client setup, auth headers, retries, and request orchestration.

**Guidance**
- Avoid placing API calls directly inside page components.

---

## 7) `utils/` (utility layer)

**Purpose**
- Pure utility functions with no React lifecycle coupling.

**Examples**
- Date formatters, object helpers, color utilities, string helpers.

---

## 8) `constants/` (constants layer)

**Purpose**
- Enums, fixed keys, route constants, and static configuration.

**Examples**
- `routes.js`, `storageKeys.js`, `themeKeys.js`.

---

## 9) `assets/` (static assets)

**Purpose**
- Images, icons, font files, static SVG resources.

**Current content**
- `assets/react.svg`
- `assets/vite.svg`

---

## 10) `styles/` (global style layer)

**Purpose**
- Global styles, reset rules, and shared styling foundation.

**Current content**
- `styles/index.css`

---

## Recommended workflow for new pages

1. Create a page folder under `pages/` (for example `pages/About/`).
2. Keep page-only components in `pages/About/components/`.
3. Extract reusable parts into `components/`.
4. If logic is cross-page and domain-driven, promote it to `features/`.
5. If capability is global, place it in `app/providers/`.

---

## Naming conventions

- Component files: `PascalCase.jsx` (for example `ThemeSwitcher.jsx`)
- Hook files: `useXxx.js`
- Utility files: `camelCase.js`
- Page folders: `PascalCase` (for example `Home/`, `Settings/`)

