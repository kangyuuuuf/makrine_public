import { motion as Motion, useReducedMotion } from 'framer-motion'
import brandIcon from '../../assets/icon_only.png'
import homePic1 from '../../assets/homePic1.png'
import homePic2 from '../../assets/homePic2.png'
import './AboutSection.css'

const EASE_OUT = [0.4, 0, 0.2, 1]

const ROW_DURATION = 0.45

const ROW_STAGGER = 0.2

function AboutSection() {
  const prefersReducedMotion = useReducedMotion()
  const reduced = Boolean(prefersReducedMotion)

  const off = { opacity: 0, y: 20 }
  const on = { opacity: 1, y: 0 }

  const innerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : ROW_STAGGER,
        delayChildren: reduced ? 0 : 0,
      },
    },
  }

  const rowVariants = {
    hidden: reduced ? on : off,
    visible: {
      ...on,
      transition: {
        type: 'tween',
        duration: reduced ? 0 : ROW_DURATION,
        ease: EASE_OUT,
      },
    },
  }

  const viewport = { once: true, amount: 0.25 }

  return (
    <section
      id="about"
      className="about-section"
      aria-labelledby="about-makrine-heading"
    >
      <Motion.div
        className="about-section__inner"
        variants={innerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <Motion.div
          className="about-section__row about-section__row--about"
          variants={rowVariants}
        >
          <div className="about-section__text about-section__text--about">
            <div className="about-section__icon" aria-hidden="true">
              <img
                className="about-section__icon-img"
                src={brandIcon}
                alt=""
                width={48}
                height={48}
                decoding="async"
              />
            </div>
            <h2 id="about-makrine-heading" className="about-section__title">
              About Makrine
            </h2>
            <p className="about-section__body">
              Makrine LLC is a Houston-based marine safety and firefighting
              equipment supplier dedicated to providing one-stop lifesaving and
              fire protection solutions for global shipping customers.
            </p>
          </div>
          <div className="about-section__media">
            <img
              className="about-section__media-img"
              src={homePic1}
              alt="Marine safety equipment and vessel operations"
              decoding="async"
              loading="lazy"
            />
          </div>
        </Motion.div>

        <Motion.div
          className="about-section__row about-section__row--mission"
          variants={rowVariants}
        >
          <div className="about-section__media">
            <img
              className="about-section__media-img"
              src={homePic2}
              alt="Ship seen through a marine vessel window"
              decoding="async"
              loading="lazy"
            />
          </div>
          <div className="about-section__text about-section__text--mission">
            <div className="about-section__icon" aria-hidden="true">
              <img
                className="about-section__icon-img"
                src={brandIcon}
                alt=""
                width={48}
                height={48}
                decoding="async"
              />
            </div>
            <h2 id="about-mission-heading" className="about-section__title">
              Our Mission
            </h2>
            <p className="about-section__body">
              Our mission is to deliver certified, high-quality marine safety
              solutions with competitive pricing and responsive service that
              customers can rely on.
            </p>
          </div>
        </Motion.div>
      </Motion.div>
    </section>
  )
}

export default AboutSection
