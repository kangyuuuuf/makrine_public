import CertificationsSection from './CertificationsSection.jsx'
import DetailSection from './DetailSection.jsx'
import ImageGallery from './ImageGallery.jsx'
import { PRODUCT_DETAIL_MOCK } from './mockProductDetail.js'
import ProductInfo from './ProductInfo.jsx'

/**
 * @param {Object} props
 * @param {{ images?: { id: string; label: string }[]; certifications?: string[]; descriptionLines?: number }} [props.data]
 */
export default function ProductDetailPage({ data = PRODUCT_DETAIL_MOCK }) {
  const images = data.images ?? PRODUCT_DETAIL_MOCK.images
  const certifications = data.certifications ?? PRODUCT_DETAIL_MOCK.certifications
  const descriptionLines = data.descriptionLines ?? PRODUCT_DETAIL_MOCK.descriptionLines

  return (
    <section className="bg-white py-8 md:py-12" aria-label="Product detail content">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            <ImageGallery images={images} />
            <ProductInfo descriptionLines={descriptionLines} />
          </section>

          <CertificationsSection badges={certifications} />
          <DetailSection />
        </div>
      </div>
    </section>
  )
}
