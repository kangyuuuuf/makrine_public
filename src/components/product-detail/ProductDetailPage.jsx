import { motion as Motion, useReducedMotion } from 'framer-motion'
import AttributesSection from './AttributesSection.jsx'
import DescriptionSection from './DescriptionSection.jsx'
import ImageGallery from './ImageGallery.jsx'
import ProductDetailAside from './ProductDetailAside.jsx'
import ProductFieldSection from './ProductFieldSection.jsx'

const EASE = [0.22, 1, 0.36, 1]

const DEFAULT_DETAIL_DATA = {
  title: 'Product',
  model: '',
  categoryName: '',
  subcategoryName: '',
  slug: '',
  images: [],
  approvals: /** @type {{ label: string; imageSrc: string | null }[]} */ ([]),
  specifications: null,
  configurations: null,
  attributes: null,
  description: '',
}

/**
 * @param {Object} props
 * @param {typeof DEFAULT_DETAIL_DATA} [props.data]
 * @param {() => void} [props.onAddToInquiry]
 */
export default function ProductDetailPage({ data = DEFAULT_DETAIL_DATA, onAddToInquiry }) {
  const reduce = useReducedMotion()
  const dur = reduce ? 0 : 0.42
  const stagger = reduce ? 0 : 0.07

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: reduce ? 0 : 0.05,
      },
    },
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: dur, ease: EASE },
    },
  }

  const galleryVariants = {
    hidden: { opacity: 0, x: reduce ? 0 : -14 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: dur, ease: EASE },
    },
  }

  const asideVariants = {
    hidden: { opacity: 0, x: reduce ? 0 : 14 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: dur, ease: EASE },
    },
  }

  const title = data.title ?? DEFAULT_DETAIL_DATA.title
  const model = data.model ?? DEFAULT_DETAIL_DATA.model
  const categoryName = data.categoryName ?? DEFAULT_DETAIL_DATA.categoryName
  const subcategoryName = data.subcategoryName ?? DEFAULT_DETAIL_DATA.subcategoryName
  const images = data.images ?? DEFAULT_DETAIL_DATA.images
  const approvals = data.approvals ?? DEFAULT_DETAIL_DATA.approvals
  const specifications = data.specifications ?? DEFAULT_DETAIL_DATA.specifications
  const configurations = data.configurations ?? DEFAULT_DETAIL_DATA.configurations
  const attributes = data.attributes ?? DEFAULT_DETAIL_DATA.attributes
  const description = data.description ?? DEFAULT_DETAIL_DATA.description

  const showConfigurations = configurations?.length > 0
  const showAttributes = attributes?.length > 0
  const showDescription = typeof description === 'string' && description.trim().length > 0

  return (
    <section className="bg-white pt-4 pb-8 md:pt-5 md:pb-12" aria-label="Product detail content">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Motion.div
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-8">
            <Motion.div
              variants={galleryVariants}
              className="flex min-h-0 w-full min-w-0 lg:h-full will-change-transform"
            >
              <ImageGallery images={images} />
            </Motion.div>
            <Motion.div
              variants={asideVariants}
              className="flex min-h-0 w-full min-w-0 lg:h-full will-change-transform"
            >
              <ProductDetailAside
                title={title}
                model={model}
                categoryName={categoryName}
                subcategoryName={subcategoryName}
                approvals={approvals}
                specifications={specifications}
                onAddToInquiry={onAddToInquiry}
              />
            </Motion.div>
          </section>

          {showConfigurations ? (
            <Motion.div variants={sectionVariants} className="will-change-transform">
              <ProductFieldSection title="Configurations" groups={configurations} />
            </Motion.div>
          ) : null}

          {showAttributes ? (
            <Motion.div variants={sectionVariants} className="will-change-transform">
              <AttributesSection attributes={attributes} />
            </Motion.div>
          ) : null}

          {showDescription ? (
            <Motion.div variants={sectionVariants} className="will-change-transform">
              <DescriptionSection description={description} />
            </Motion.div>
          ) : null}
        </Motion.div>
      </div>
    </section>
  )
}
