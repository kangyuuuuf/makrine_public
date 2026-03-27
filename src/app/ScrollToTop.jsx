import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * 路由切换后将视口滚回顶部（同页仅 hash 变化不处理，保留锚点跳转行为）
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
