import { useCallback } from 'react'
import logoImg from '../../assets/icon.png'
import './FooterSection.css'

function FooterSection() {
  const handleSubmit = useCallback((event) => {
    event.preventDefault()
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
                <a href="mailto:laura@makrine.com">laura@makrine.com</a>
              </dd>
            </div>
            <div className="footer-section__contact-block">
              <dt>Operations</dt>
              <dd>
                <a href="mailto:annie@makrine.com">annie@makrine.com</a>
                <br />
                <a href="mailto:kai@makrine.com">kai@makrine.com</a>
              </dd>
            </div>
            <div className="footer-section__contact-block">
              <dt>Phone</dt>
              <dd>
                <a href="tel:+17132555005">(713) 255-5005</a>
              </dd>
            </div>
            <div className="footer-section__contact-block">
              <dt>Email</dt>
              <dd>
                <a href="mailto:admin@makrine.com">admin@makrine.com</a>
              </dd>
            </div>
          </dl>
        </section>

        <section
          className="footer-section__panel footer-section__panel--form"
          aria-labelledby="footer-form-heading"
        >
          <h2 className="footer-section__form-title" id="footer-form-heading">
            Ask the Captain
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
                <span className="footer-section__label">Subject</span>
                <input className="footer-section__input" name="subject" type="text" />
              </label>
            </div>
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
            <button className="footer-section__submit" type="submit">
              Submit
            </button>
          </form>
        </section>
      </div>
    </footer>
  )
}

export default FooterSection
