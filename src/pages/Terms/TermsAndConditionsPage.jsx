import { useEffect } from 'react'

export const TERMS_AND_CONDITIONS_ROUTE = '/terms-and-conditions'
export const TERMS_AND_CONDITIONS_PDF = '/terms-and-conditions.pdf'
export const TERMS_AND_CONDITIONS_FILENAME = 'Makrine-Terms-and-Conditions.pdf'

function getTermsPdfUrl() {
  return new URL(TERMS_AND_CONDITIONS_PDF, window.location.origin + import.meta.env.BASE_URL).href
}

export default function TermsAndConditionsPage() {
  useEffect(() => {
    window.location.replace(getTermsPdfUrl())
  }, [])

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-center">
      <p>Opening Terms &amp; Conditions…</p>
    </main>
  )
}
