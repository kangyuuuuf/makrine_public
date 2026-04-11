import { Resend } from 'resend'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const REQUIRED_FIELDS = ['companyName', 'email', 'firstName', 'lastName', 'inquiryType', 'productName']
const INQUIRY_TYPE_LABEL = {
  quotation: 'Request a Quotation',
  product_info: 'Request Product Information',
}

function json(res, status, payload) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8').end(JSON.stringify(payload))
}

function normalizeBody(body) {
  if (!body) return null
  if (typeof body === 'string') {
    try {
      return JSON.parse(body)
    } catch {
      return null
    }
  }
  if (typeof body === 'object') return body
  return null
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function validatePayload(payload) {
  if (!payload || typeof payload !== 'object') return 'Invalid request payload.'
  for (const key of REQUIRED_FIELDS) {
    if (!String(payload[key] ?? '').trim()) return `Field "${key}" is required.`
  }
  if (!EMAIL_RE.test(String(payload.email).trim())) return 'A valid email is required.'
  if (!INQUIRY_TYPE_LABEL[payload.inquiryType]) return 'Invalid inquiry type.'
  return ''
}

function buildEmailHtml(payload) {
  const pairs = [
    ['Inquiry Type', INQUIRY_TYPE_LABEL[payload.inquiryType]],
    ['Company Name', payload.companyName],
    ['First Name', payload.firstName],
    ['Last Name', payload.lastName],
    ['Email', payload.email],
    ['Product Name', payload.productName],
    ['Product ID', payload.productId || '-'],
    ['Message', payload.message || '-'],
  ]
  return `
    <h2>New Product Inquiry</h2>
    <p>A new inquiry was submitted from the catalog form.</p>
    <table cellpadding="8" cellspacing="0" border="1" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px;">
      <tbody>
        ${pairs
          .map(
            ([label, value]) => `
              <tr>
                <td><strong>${escapeHtml(label)}</strong></td>
                <td>${escapeHtml(value)}</td>
              </tr>
            `,
          )
          .join('')}
      </tbody>
    </table>
  `
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return json(res, 405, { message: 'Method not allowed.' })
  }

  const env = globalThis.process?.env ?? {}
  const apiKey = env.RESEND_API_KEY
  const fromEmail = env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
  const toEmail = env.RESEND_TO_EMAIL || 'tech@makrine.com'
  if (!apiKey) return json(res, 500, { message: 'RESEND_API_KEY is not configured.' })

  const payload = normalizeBody(req.body)
  const validationMessage = validatePayload(payload)
  if (validationMessage) return json(res, 400, { message: validationMessage })

  try {
    const resend = new Resend(apiKey)
    await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: String(payload.email).trim(),
      subject: `[Inquiry] ${String(payload.productName).trim()}`,
      html: buildEmailHtml(payload),
    })
    return json(res, 200, { ok: true })
  } catch (error) {
    const detail = error instanceof Error ? error.message : ''
    return json(res, 500, {
      message: detail ? `Email delivery failed: ${detail}` : 'Email delivery failed.',
    })
  }
}
