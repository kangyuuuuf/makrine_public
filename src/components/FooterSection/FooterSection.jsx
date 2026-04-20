import { useCallback, useEffect, useMemo, useState } from 'react'
import logoImg from '../../assets/icon.png'
import InquiryPopup from '../inquiry/InquiryPopup.jsx'
import './FooterSection.css'

const CONTACT_API_ENDPOINT = import.meta.env.VITE_CONTACT_API_URL || ''

function FooterSection() {
  const [submitting, setSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState({
    open: false,
    status: /** @type {'success' | 'error'} */ ('success'),
    message: '',
  })

  const submitButtonLabel = useMemo(() => {
    if (submitting) return 'Sending...'
    return 'Submit'
  }, [submitting])

  const closeResultModal = useCallback(() => {
    setSubmitResult((prev) => ({ ...prev, open: false }))
  }, [])

  useEffect(() => {
    if (!submitResult.open) return undefined
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onEsc = (event) => {
      if (event.key === 'Escape') closeResultModal()
    }
    window.addEventListener('keydown', onEsc)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', onEsc)
    }
  }, [closeResultModal, submitResult.open])

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault()
    if (!CONTACT_API_ENDPOINT) {
      setSubmitResult({
        open: true,
        status: 'error',
        message: 'Contact API is not configured. Please set VITE_CONTACT_API_URL.',
      })
      return
    }

    const formElement = event.currentTarget
    const formData = new FormData(formElement)
    const payload = {
      firstName: String(formData.get('firstName') || '').trim(),
      lastName: String(formData.get('lastName') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      customerType: String(formData.get('customerType') || '').trim(),
      companyName: String(formData.get('companyName') || '').trim(),
      message: String(formData.get('message') || '').trim(),
      newsletter: formData.get('newsletter') === 'on',
    }

    setSubmitting(true)

    try {
      const response = await fetch(CONTACT_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        let message = 'Unable to send your message right now. Please try again later.'
        try {
          const data = await response.json()
          if (typeof data?.message === 'string' && data.message.trim()) {
            message = data.message
          }
        } catch {
          // Keep fallback message when response body is not valid JSON.
        }
        throw new Error(message)
      }

      setSubmitResult({
        open: true,
        status: 'success',
        message: 'Thanks for contacting us. We have received your message and will get back to you soon!',
      })
      formElement.reset()
    } catch (error) {
      const fallback = 'Unable to send your message right now. Please try again later.'
      if (error instanceof Error && error.message.trim()) {
        setSubmitResult({
          open: true,
          status: 'error',
          message: error.message,
        })
      } else {
        setSubmitResult({
          open: true,
          status: 'error',
          message: fallback,
        })
      }
    } finally {
      setSubmitting(false)
    }
  }, [])

  return (
    <footer className="footer-section" id="contact">
      <div className="footer-section__inner">
        <section
          className="footer-section__panel footer-section__panel--info"
          aria-labelledby="footer-location-heading"
        >
          <a className="footer-section__brand" href="#home">
            <img
              className="footer-section__logo"
              src={logoImg}
              alt="Makrine"
              decoding="async"
            />
          </a>
          <h2 className="footer-section__heading" id="footer-location-heading">
            Our Location
          </h2>
          <address className="footer-section__address">
            3130 Strawberry Rd, Suite D
            <br />
            Pasadena, TX 77504
          </address>
          <dl className="footer-section__contacts">
            <div className="footer-section__contact-block">
              <dt>Sales</dt>
              <dd>
                <a href="mailto:sales@makrine.com">sales@makrine.com</a>
              </dd>
            </div>
            <div className="footer-section__contact-block">
              <dt>Operations</dt>
              <dd>
                <a href="mailto:admin@makrine.com">admin@makrine.com</a>
              </dd>
            </div>
            <div className="footer-section__contact-block">
              <dt>Phone</dt>
              <dd>
                <a href="tel:+17132555005">(713) 255-5005</a>
              </dd>
            </div>
            {/* <div className="footer-section__contact-block">
              <dt>Email</dt>
              <dd>
                <a href="mailto:admin@makrine.com">admin@makrine.com</a>
              </dd>
            </div> */}
          </dl>
        </section>

        <section
          className="footer-section__panel footer-section__panel--form"
          aria-labelledby="footer-form-heading"
        >
          <h2 className="footer-section__form-title" id="footer-form-heading">
            Leave a Message
          </h2>
          <form className="footer-section__form" onSubmit={handleSubmit} noValidate>
            <div className="footer-section__form-row">
              <label className="footer-section__field">
                <span className="footer-section__label">
                  First Name <span className="footer-section__required">*</span>
                </span>
                <input
                  className="footer-section__input"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  aria-required="true"
                />
              </label>
              <label className="footer-section__field">
                <span className="footer-section__label">
                  Last Name <span className="footer-section__required">*</span>
                </span>
                <input
                  className="footer-section__input"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  aria-required="true"
                />
              </label>
            </div>
            <div className="footer-section__form-row">
              <label className="footer-section__field">
                <span className="footer-section__label">
                  Email <span className="footer-section__required">*</span>
                </span>
                <input
                  className="footer-section__input"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  aria-required="true"
                />
              </label>
              <label className="footer-section__field">
                <span className="footer-section__label">
                  Type of Customer <span className="footer-section__required">*</span>
                </span>
                <select
                  className="footer-section__input"
                  name="customerType"
                  defaultValue=""
                  required
                  aria-required="true"
                >
                  <option value="" disabled>
                    Select customer type
                  </option>
                  <option value="distributor">Distributor</option>
                  <option value="ship-agent">Ship Agent</option>
                  <option value="service-station">Service Station</option>
                  <option value="end-user">End User</option>
                </select>
              </label>
            </div>
            <label className="footer-section__field footer-section__field--full">
              <span className="footer-section__label">
                Company Name <span className="footer-section__required">*</span>
              </span>
              <input
                className="footer-section__input"
                name="companyName"
                type="text"
                required
                aria-required="true"
              />
            </label>
            <label className="footer-section__field footer-section__field--full">
              <span className="footer-section__label">Message</span>
              <textarea
                className="footer-section__input footer-section__textarea"
                name="message"
                rows={5}
              />
            </label>
            <label className="footer-section__newsletter">
              <input
                className="footer-section__checkbox"
                name="newsletter"
                type="checkbox"
              />
              <span>Yes, subscribe me to your newsletter.</span>
            </label>
            <button className="footer-section__submit" type="submit" disabled={submitting}>
              {submitButtonLabel}
            </button>
          </form>
        </section>
      </div>
      <InquiryPopup
        isOpen={submitResult.open}
        ariaLabelledBy="footer-result-title"
        overlayLabel="Close result dialog"
        onClose={closeResultModal}
      >
        <div className="footer-section__result-content">
          <h3 id="footer-result-title" className="footer-section__result-title">
            {submitResult.status === 'success' ? 'Message Sent' : 'Failed to Send'}
          </h3>
          <p
            className={`footer-section__result-message ${
              submitResult.status === 'success'
                ? 'footer-section__result-message--success'
                : 'footer-section__result-message--error'
            }`}
          >
            {submitResult.message}
          </p>
          <button type="button" className="footer-section__result-close" onClick={closeResultModal}>
            Close
          </button>
        </div>
      </InquiryPopup>
    </footer>
  )
}

export default FooterSection
