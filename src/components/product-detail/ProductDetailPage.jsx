import CertificationsSection from './CertificationsSection.jsx'
import DetailSection from './DetailSection.jsx'
import ImageGallery from './ImageGallery.jsx'
import ProductInfo from './ProductInfo.jsx'

const DEFAULT_DETAIL_DATA = {
  images: [],
  certifications: [],
  descriptionLines: 4,
}

/**
 * @param {Object} props
 * @param {{
 *   images?: { id: string; label: string; src?: string }[];
 *   certifications?: string[];
 *   descriptionLines?: number;
 *   name?: string;
 *   slug?: string;
 *   model?: string;
 * }} [props.data]
 */
export default function ProductDetailPage({ data = DEFAULT_DETAIL_DATA }) {
  const images = data.images ?? DEFAULT_DETAIL_DATA.images
  const certifications = data.certifications ?? DEFAULT_DETAIL_DATA.certifications
  const descriptionLines = data.descriptionLines ?? DEFAULT_DETAIL_DATA.descriptionLines
  const name = data.name ?? 'Product Information'
  const slug = data.slug ?? ''
  const model = data.model ?? ''

  return (
    <section className="bg-white py-8 md:py-12" aria-label="Product detail content">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            <ImageGallery images={images} />
            <ProductInfo
              name={name}
              slug={slug}
              model={model}
              descriptionLines={descriptionLines}
            />
          </section>

          <CertificationsSection badges={certifications} />
          <DetailSection />
        </div>
      </div>
    </section>
  )
}
