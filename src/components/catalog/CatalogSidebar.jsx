import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { motion as Motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import {
  DIVISION_LABELS,
  DIVISION_ORDER,
  FILTER_GROUPS,
} from '../../data/catalogMock.js'

function FilterSection({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <details
      open={open}
      onToggle={(e) => setOpen(e.currentTarget.open)}
      className="group border-b border-[var(--border)] py-1 last:border-b-0"
    >
      <summary className="cursor-pointer list-none py-3 text-sm font-semibold text-[var(--text-primary)] [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between gap-2">
          {title}
          <span className="text-[var(--text-secondary)] transition group-open:rotate-180">▾</span>
        </span>
      </summary>
      <div className="space-y-2 pb-4 pl-0.5">{children}</div>
    </details>
  )
}

/**
 * @param {Object} props
 * @param {'life-saving' | 'fire-fighting'} props.division
 * @param {(id: 'life-saving' | 'fire-fighting') => void} props.onDivisionChange
 * @param {{ value: string; label: string }[]} props.categoryOptions
 * @param {string} props.searchQuery
 * @param {(v: string) => void} props.onSearchChange
 * @param {Set<string>} props.categories
 * @param {(value: string) => void} props.onCategoryToggle
 * @param {Set<string>} props.availability
 * @param {(value: string) => void} props.onAvailabilityToggle
 * @param {Set<string>} props.certifications
 * @param {(value: string) => void} props.onCertToggle
 * @param {() => void} props.onClearFilters
 * @param {boolean} [props.suppressMobileHeader]
 */
export default function CatalogSidebar({
  division,
  onDivisionChange,
  categoryOptions,
  searchQuery,
  onSearchChange,
  categories,
  onCategoryToggle,
  availability,
  onAvailabilityToggle,
  certifications,
  onCertToggle,
  onClearFilters,
  suppressMobileHeader = false,
}) {
  const reduce = useReducedMotion()

  const filterBody = (
    <>
      <div className="relative">
        <MagnifyingGlassIcon
          className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-secondary)]"
          aria-hidden
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search product name…"
          autoComplete="off"
          className="w-full rounded-md border border-[var(--border)] bg-white py-2.5 pl-10 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
        />
      </div>

      <div className="mt-4 space-y-2">
        <label
          htmlFor="catalog-section"
          className="block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)]"
        >
          Section
        </label>
        <select
          id="catalog-section"
          value={division}
          onChange={(e) =>
            onDivisionChange(/** @type {'life-saving' | 'fire-fighting'} */ (e.target.value))
          }
          className="w-full rounded-md border border-[var(--border)] bg-white px-3 py-2.5 text-sm font-medium text-[var(--text-primary)] focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
        >
          {DIVISION_ORDER.map((id) => (
            <option key={id} value={id}>
              {DIVISION_LABELS[id]}
            </option>
          ))}
        </select>
      </div>

      <Motion.div
        key={division}
        className="mt-6 border-t border-[var(--border)] pt-2"
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        <FilterSection title="Category">
          {categoryOptions.map(({ value, label }) => (
            <label
              key={value}
              className="flex cursor-pointer items-start gap-2.5 text-sm text-[var(--text-secondary)]"
            >
              <input
                type="checkbox"
                checked={categories.has(value)}
                onChange={() => onCategoryToggle(value)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-[var(--border)] text-[var(--color-primary-600)] focus:ring-[var(--focus-ring)]"
              />
              <span className="leading-snug">{label}</span>
            </label>
          ))}
        </FilterSection>

        <FilterSection title="Availability">
          {FILTER_GROUPS.availability.map(({ value, label }) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-[var(--text-secondary)]"
            >
              <input
                type="checkbox"
                checked={availability.has(value)}
                onChange={() => onAvailabilityToggle(value)}
                className="h-4 w-4 rounded border-[var(--border)] text-[var(--color-primary-600)] focus:ring-[var(--focus-ring)]"
              />
              {label}
            </label>
          ))}
        </FilterSection>

        <FilterSection title="Certification">
          {FILTER_GROUPS.certifications.map(({ value, label }) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-[var(--text-secondary)]"
            >
              <input
                type="checkbox"
                checked={certifications.has(value)}
                onChange={() => onCertToggle(value)}
                className="h-4 w-4 rounded border-[var(--border)] text-[var(--color-primary-600)] focus:ring-[var(--focus-ring)]"
              />
              {label}
            </label>
          ))}
        </FilterSection>
      </Motion.div>

      <button
        type="button"
        onClick={onClearFilters}
        className="mt-6 w-full rounded-md border border-[var(--border)] bg-neutral-50 px-3 py-2 text-sm font-medium text-[var(--text-primary)] transition hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
      >
        Clear filters
      </button>
    </>
  )

  return (
    <div className="flex h-full min-h-0 flex-col">
      {suppressMobileHeader ? null : (
        <div className="mb-3 shrink-0 lg:mb-0 lg:hidden">
          <span className="text-sm font-semibold text-[var(--text-primary)]">Filters</span>
        </div>
      )}
      <div className="min-h-0 flex-1 overflow-y-auto lg:overflow-visible">{filterBody}</div>
    </div>
  )
}
