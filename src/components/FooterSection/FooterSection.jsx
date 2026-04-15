import { useCallback, useMemo, useState } from 'react'
import logoImg from '../../assets/icon.png'
import './FooterSection.css'

const CONTACT_API_ENDPOINT = import.meta.env.VITE_CONTACT_API_URL || ''

function FooterSection() {
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const submitButtonLabel = useMemo(() => {
    if (submitting) return 'Sending...'
    return 'Submit'
  }, [submitting])

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault()
    if (!CONTACT_API_ENDPOINT) {
      setSubmitSuccess(false)
      setSubmitError('Contact API is not configured. Please set VITE_CONTACT_API_URL.')
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
    setSubmitError('')
    setSubmitSuccess(false)

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

      setSubmitSuccess(true)
      formElement.reset()
    } catch (error) {
      const fallback = 'Unable to send your message right now. Please try again later.'
      if (error instanceof Error && error.message.trim()) {
        setSubmitError(error.message)
      } else {
        setSubmitError(fallback)
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
                    
                  </option>
                  <option value="end-user">End User</option>
                  <option value="retailer">Retailer</option>
                  <option value="boat-builder">Boat Builder</option>
                  <option value="distributor">Distributor</option>
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
            {submitError ? <p className="footer-section__submit-feedback footer-section__submit-feedback--error">{submitError}</p> : null}
            {submitSuccess ? (
              <p className="footer-section__submit-feedback footer-section__submit-feedback--success">
                Your message has been sent successfully.
              </p>
            ) : null}
            <button className="footer-section__submit" type="submit" disabled={submitting}>
              {submitButtonLabel}
            </button>
          </form>
        </section>
      </div>
    </footer>
  )
}

export default FooterSection
