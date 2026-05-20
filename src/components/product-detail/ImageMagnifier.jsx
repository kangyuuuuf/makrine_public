import { useCallback, useEffect, useRef, useState } from 'react'

const LENS_SIZE = 140
const ZOOM = 2.5
const LENS_OFFSET = 16

function canUseHoverMagnifier() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

/** @returns {{ left: number; top: number; width: number; height: number } | null} */
function getContainedImageRect(container, naturalWidth, naturalHeight) {
  if (!container || !naturalWidth || !naturalHeight) return null

  const { width: cw, height: ch } = container.getBoundingClientRect()
  const imageAspect = naturalWidth / naturalHeight
  const containerAspect = cw / ch

  let width
  let height
  if (imageAspect > containerAspect) {
    width = cw
    height = cw / imageAspect
  } else {
    height = ch
    width = ch * imageAspect
  }

  return {
    left: (cw - width) / 2,
    top: (ch - height) / 2,
    width,
    height,
  }
}

/**
 * @param {Object} props
 * @param {string} props.src
 * @param {string} props.alt
 * @param {string} [props.className]
 * @param {boolean} [props.disabled]
 */
export default function ImageMagnifier({ src, alt, className = '', disabled = false }) {
  const containerRef = useRef(null)
  const imageRef = useRef(null)
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 })
  const [hovering, setHovering] = useState(false)
  const [isOverImage, setIsOverImage] = useState(false)
  const [lensPos, setLensPos] = useState({ left: 0, top: 0 })
  const [bgStyle, setBgStyle] = useState({ backgroundSize: '', backgroundPosition: '' })
  const [magnifierEnabled, setMagnifierEnabled] = useState(false)

  useEffect(() => {
    setHovering(false)
    setIsOverImage(false)
    setNaturalSize({ width: 0, height: 0 })

    const img = imageRef.current
    if (img?.complete && img.naturalWidth > 0) {
      setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight })
    }
  }, [src])

  useEffect(() => {
    setMagnifierEnabled(canUseHoverMagnifier())
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const onChange = () => setMagnifierEnabled(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const updateLens = useCallback(
    (clientX, clientY) => {
      const container = containerRef.current
      if (!container) return

      const containerRect = container.getBoundingClientRect()
      const imageRect = getContainedImageRect(container, naturalSize.width, naturalSize.height)
      if (!imageRect) return

      const localX = clientX - containerRect.left - imageRect.left
      const localY = clientY - containerRect.top - imageRect.top

      if (localX < 0 || localY < 0 || localX > imageRect.width || localY > imageRect.height) {
        setHovering(false)
        setIsOverImage(false)
        return
      }

      setIsOverImage(true)

      const ratioX = localX / imageRect.width
      const ratioY = localY / imageRect.height

      const zoomedWidth = imageRect.width * ZOOM
      const zoomedHeight = imageRect.height * ZOOM

      setBgStyle({
        backgroundSize: `${zoomedWidth}px ${zoomedHeight}px`,
        backgroundPosition: `${LENS_SIZE / 2 - ratioX * zoomedWidth}px ${LENS_SIZE / 2 - ratioY * zoomedHeight}px`,
      })

      let left = clientX - containerRect.left + LENS_OFFSET
      let top = clientY - containerRect.top - LENS_SIZE / 2

      const maxLeft = containerRect.width - LENS_SIZE - 4
      const maxTop = containerRect.height - LENS_SIZE - 4

      if (left + LENS_SIZE > containerRect.width - 4) {
        left = clientX - containerRect.left - LENS_SIZE - LENS_OFFSET
      }
      left = Math.max(4, Math.min(left, maxLeft))
      top = Math.max(4, Math.min(top, maxTop))

      setLensPos({ left, top })
      setHovering(true)
    },
    [naturalSize.height, naturalSize.width],
  )

  const onMouseMove = (event) => {
    if (disabled || !magnifierEnabled) return
    updateLens(event.clientX, event.clientY)
  }

  const onMouseLeave = () => {
    setHovering(false)
    setIsOverImage(false)
  }

  const onImageLoad = (event) => {
    const { naturalWidth, naturalHeight } = event.currentTarget
    setNaturalSize({ width: naturalWidth, height: naturalHeight })
  }

  const showLens = magnifierEnabled && !disabled && hovering && naturalSize.width > 0
  const showZoomCursor = magnifierEnabled && !disabled && isOverImage

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full ${showZoomCursor ? 'cursor-zoom-in' : ''}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className={`${className}${showZoomCursor ? ' cursor-zoom-in' : ''}`}
        onLoad={onImageLoad}
        draggable={false}
      />
      {showLens ? (
        <div
          role="presentation"
          aria-hidden
          className="pointer-events-none absolute z-10 overflow-hidden rounded-2xl border-2 border-white bg-white shadow-lg ring-1 ring-slate-200/80"
          style={{
            width: LENS_SIZE,
            height: LENS_SIZE,
            left: lensPos.left,
            top: lensPos.top,
            backgroundImage: `url(${src})`,
            backgroundRepeat: 'no-repeat',
            ...bgStyle,
          }}
        />
      ) : null}
    </div>
  )
}
