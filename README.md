# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Deploy to GitHub Pages

This repository is configured with a GitHub Actions workflow:

- Workflow file: `.github/workflows/deploy-pages.yml`
- Trigger: push to `main`
- Output: deploys `dist/` to GitHub Pages

### One-time GitHub settings

1. Open repository **Settings** -> **Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push to `main` (or run the workflow manually) to publish.

Site URL will be available under your repository's GitHub Pages address after deployment succeeds.

## Inquiry Email Integration (Resend)

This project includes API handlers for sending emails through Resend:

- `api/send-inquiry.js` for catalog product inquiry emails
- `api/send-contact-message.js` for footer "Leave a Message" emails

### Environment variables

Create a `.env` file (or set deployment secrets) with:

```bash
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=onboarding@resend.dev
RESEND_TO_EMAIL=tech@makrine.com
VITE_INQUIRY_API_URL=https://your-api-domain.com/api/send-inquiry
VITE_CONTACT_API_URL=https://your-api-domain.com/api/send-contact-message
```

### Important for GitHub Pages

GitHub Pages is static hosting and does not run `api/*` functions.
Deploy both API handlers on a serverless platform (for example Vercel/Netlify), then point:

- `VITE_INQUIRY_API_URL` to `/api/send-inquiry`
- `VITE_CONTACT_API_URL` to `/api/send-contact-message`
