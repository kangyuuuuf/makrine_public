import { CheckCircleIcon, LockClosedIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useEffect, useMemo, useState } from 'react'
import InquiryPopup from './InquiryPopup.jsx'

const INQUIRY_TYPE_OPTIONS = [
  { value: 'quotation', label: 'Request a Quotation' },
  { value: 'product_info', label: 'Request Product Information' },
]

const INITIAL_FORM = {
  companyName: '',
  email: '',
  firstName: '',
  lastName: '',
  inquiryType: '',
  message: '',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function buildValidationErrors(form, productName) {
  const errors = {}
  if (!form.companyName.trim()) errors.companyName = 'Company name is required.'
  if (!form.email.trim()) errors.email = 'Email address is required.'
  else if (!EMAIL_RE.test(form.email.trim())) errors.email = 'Please enter a valid email address.'
  if (!form.firstName.trim()) errors.firstName = 'First name is required.'
  if (!form.lastName.trim()) errors.lastName = 'Last name is required.'
  if (!form.inquiryType) errors.inquiryType = 'Please select an inquiry type.'
  if (!productName) errors.productName = 'Product information is unavailable. Please retry from the product card.'
  return errors
}

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {string} props.productName
 * @param {string} [props.productId]
 * @param {() => void} props.onClose
 * @param {(payload: {
 *  companyName: string
 *  email: string
 *  firstName: string
 *  lastName: string
 *  inquiryType: 'quotation' | 'product_info'
 *  productName: string
 *  productId?: string
 *  message?: string
 * }) => Promise<{ inquiryId?: string } | void> | { inquiryId?: string } | void} [props.onSubmit]
 */
export default function QuotationInquiryModal({
  isOpen,
  productName,
  productId,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submittedInquiryId, setSubmittedInquiryId] = useState('')
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setForm(INITIAL_FORM)
      setErrors({})
      setSubmitting(false)
      setSubmitSuccess(false)
      setSubmittedInquiryId('')
      setSubmitError('')
      return
    }
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return undefined
    const onEsc = (event) => {
      if (event.key === 'Escape' && !submitting) onClose()
    }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [isOpen, onClose, submitting])

  const currentValidation = useMemo(
    () => buildValidationErrors(form, productName),
    [form, productName],
  )
  const isFormValid = Object.keys(currentValidation).length === 0

  const fieldClass = (errorKey) =>
    `mt-1 w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-[var(--text-primary)] shadow-sm transition focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] ${
      errors[errorKey]
        ? 'border-red-400 focus:border-red-500'
        : 'border-[var(--border)] focus:border-[var(--color-primary-500)]'
    }`

  const handleFieldChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (submitError) setSubmitError('')
    setErrors((prev) => {
      if (!prev[key] && !(key === 'email' && prev.email)) return prev
      const next = { ...prev }
      delete next[key]
      if (key === 'email') delete next.email
      return next
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = buildValidationErrors(form, productName)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    setSubmitError('')
    try {
      const result = await onSubmit?.({
        companyName: form.companyName.trim(),
        email: form.email.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        inquiryType: /** @type {'quotation' | 'product_info'} */ (form.inquiryType),
        productName,
        productId,
        message: form.message.trim() || undefined,
      })
      setSubmittedInquiryId(typeof result?.inquiryId === 'string' ? result.inquiryId : '')
      setSubmitSuccess(true)
    } catch (error) {
      const fallbackMessage = 'Failed to send inquiry. Please try again in a moment.'
      if (error instanceof Error && error.message.trim()) {
        setSubmitError(error.message)
      } else {
        setSubmitError(fallbackMessage)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <InquiryPopup
      isOpen={isOpen}
      ariaLabelledBy="quotation-modal-title"
      overlayLabel="Close inquiry form"
      onClose={() => {
        if (!submitting) onClose()
      }}
    >
      <button
        type="button"
        onClick={onClose}
        disabled={submitting}
        aria-label="Close modal"
        className="absolute right-3 top-3 rounded-lg p-2 text-[var(--text-secondary)] transition hover:bg-neutral-100 hover:text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>

      {submitSuccess ? (
        <div className="px-6 py-10 sm:px-8">
          <div className="mx-auto max-w-md text-center">
            <CheckCircleIcon className="mx-auto h-11 w-11 text-emerald-600" aria-hidden />
            <h2 id="quotation-modal-title" className="mt-4 text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Inquiry Submitted
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
              Thank you for your request. Our team will review your inquiry and get back to you shortly.
            </p>
            {submittedInquiryId ? (
              <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">
                Inquiry ID: {submittedInquiryId}
              </p>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              className="mt-7 inline-flex items-center justify-center rounded-lg bg-[var(--color-primary-600)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-primary-700)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <form className="px-4 pb-5 pt-6 sm:px-8 sm:pb-7" onSubmit={handleSubmit} noValidate>
                  <div className="mb-6 pr-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
                      Makrine Sales Team
                    </p>
                    <h2 id="quotation-modal-title" className="mt-2 text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                      Request a Quote
                    </h2>
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">
                      Please fill out the form below and our team will get back to you shortly.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="sm:col-span-2">
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        Company Name <span className="text-red-500">*</span>
                      </span>
                      <input
                        type="text"
                        value={form.companyName}
                        onChange={(e) => handleFieldChange('companyName', e.target.value)}
                        placeholder="Enter your company name"
                        autoComplete="organization"
                        className={fieldClass('companyName')}
                      />
                      <p className="mt-1 text-xs text-[var(--text-secondary)]">Your registered company or trading name.</p>
                      {errors.companyName ? (
                        <p className="mt-1 text-xs font-medium text-red-600">{errors.companyName}</p>
                      ) : null}
                    </label>

                    <label>
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        First Name <span className="text-red-500">*</span>
                      </span>
                      <input
                        type="text"
                        value={form.firstName}
                        onChange={(e) => handleFieldChange('firstName', e.target.value)}
                        placeholder="First name"
                        autoComplete="given-name"
                        className={fieldClass('firstName')}
                      />
                      {errors.firstName ? <p className="mt-1 text-xs font-medium text-red-600">{errors.firstName}</p> : null}
                    </label>

                    <label>
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        Last Name <span className="text-red-500">*</span>
                      </span>
                      <input
                        type="text"
                        value={form.lastName}
                        onChange={(e) => handleFieldChange('lastName', e.target.value)}
                        placeholder="Last name"
                        autoComplete="family-name"
                        className={fieldClass('lastName')}
                      />
                      {errors.lastName ? <p className="mt-1 text-xs font-medium text-red-600">{errors.lastName}</p> : null}
                    </label>

                    <label>
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        Email Address <span className="text-red-500">*</span>
                      </span>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                        placeholder="Enter your email"
                        autoComplete="email"
                        className={fieldClass('email')}
                      />
                      <p className="mt-1 text-xs text-[var(--text-secondary)]">Use your business email for faster follow-up.</p>
                      {errors.email ? <p className="mt-1 text-xs font-medium text-red-600">{errors.email}</p> : null}
                    </label>

                    <label>
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        Inquiry Type <span className="text-red-500">*</span>
                      </span>
                      <select
                        value={form.inquiryType}
                        onChange={(e) => handleFieldChange('inquiryType', e.target.value)}
                        className={fieldClass('inquiryType')}
                      >
                        <option value="">Select inquiry type</option>
                        {INQUIRY_TYPE_OPTIONS.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                      {errors.inquiryType ? (
                        <p className="mt-1 text-xs font-medium text-red-600">{errors.inquiryType}</p>
                      ) : null}
                    </label>

                    <label className="sm:col-span-2">
                      <span className="flex items-center gap-1.5 text-sm font-medium text-[var(--text-primary)]">
                        Product <span className="text-red-500">*</span>
                        <LockClosedIcon className="h-3.5 w-3.5 text-[var(--text-secondary)]" aria-hidden />
                      </span>
                      <input
                        type="text"
                        value={productName || ''}
                        readOnly
                        aria-readonly="true"
                        className="mt-1 w-full rounded-lg border border-[var(--border)] bg-neutral-100 px-3 py-2.5 text-sm text-[var(--text-primary)] shadow-sm"
                      />
                      <p className="mt-1 text-xs text-[var(--text-secondary)]">
                        Product is automatically selected from your previous click.
                      </p>
                      {errors.productName ? (
                        <p className="mt-1 text-xs font-medium text-red-600">{errors.productName}</p>
                      ) : null}
                    </label>

                    <label className="sm:col-span-2">
                      <span className="text-sm font-medium text-[var(--text-primary)]">Additional Message</span>
                      <textarea
                        value={form.message}
                        onChange={(e) => handleFieldChange('message', e.target.value)}
                        placeholder="Add any extra details about your request"
                        rows={4}
                        className={fieldClass('message')}
                      />
                    </label>
                  </div>

                  <div className="mt-6 flex flex-col-reverse gap-2.5 border-t border-[var(--border)] pt-5 sm:flex-row sm:items-center sm:justify-end">
                    {submitError ? (
                      <p className="text-sm font-medium text-red-600 sm:mr-auto">{submitError}</p>
                    ) : null}
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={submitting}
                      className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--text-primary)] shadow-sm transition hover:border-[var(--color-primary-300)] hover:bg-[var(--color-primary-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!isFormValid || submitting}
                      className="inline-flex items-center justify-center rounded-lg bg-[var(--color-primary-600)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-primary-700)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)] disabled:cursor-not-allowed disabled:bg-[var(--color-primary-300)]"
                    >
                      {submitting ? 'Sending...' : 'Send Inquiry'}
                    </button>
                  </div>
        </form>
      )}
    </InquiryPopup>
  )
}
