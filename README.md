# DXN — One-Page Spirulina Store

A single-product e-commerce flow. Users land on the product page, configure quantity, drop a pin on a map (or fill the address manually), review their order, and confirm cash-on-delivery.

Built with **React 18**, **Vite**, **MUI 5**, and **pnpm**. UI vocabulary mirrors the JujuShop client (palette, typography, shadows, component overrides).

## Stack

- React 18 + Vite (JS / JSX)
- MUI 5 + Emotion (light theme only, RTL via `stylis-plugin-rtl`)
- React Router 6
- React Hook Form + Yup
- i18next (English + Arabic, with direction toggle)
- `@react-google-maps/api` for the location picker
- Notistack for snackbars
- Framer Motion for entry animations

## Quick start

```bash
pnpm install
cp .env.example .env.local      # add your Google Maps key
pnpm dev
```

Then open <http://localhost:5173>.

## Environment

| Variable                     | Purpose                                                                                   |
| ---------------------------- | ----------------------------------------------------------------------------------------- |
| `VITE_GOOGLE_MAPS_API_KEY`   | Maps JavaScript API key. Without it the map falls back to a placeholder; the manual address form still works. |

## Project layout

```
src/
├── App.jsx                    # providers (theme, snackbar, i18n, order context, router)
├── routes.jsx                 # 4-page flow
├── layouts/main-layout.jsx    # sticky header + language switcher + back button
├── theme/                     # palette, typography, custom shadows, MUI overrides
├── locales/                   # i18n setup + EN/AR translations
├── components/                # iconify wrapper, hook-form wrappers, language popover
├── contexts/order-context.jsx # quantity, address, tracking id
├── data/product.js            # the single product (mock data — swap in real images + copy)
├── pages/
│   ├── product/               # carousel + summary + description tabs
│   ├── location.jsx           # Google Maps + manual address form
│   ├── review.jsx             # order summary + COD confirmation
│   └── thank-you.jsx          # generated tracking ID + next-steps timeline
└── utils/                     # currency + tracking-id helpers
```

## Customizing the product

Edit `src/data/product.js`. The `images` array accepts any URLs (replace the Unsplash placeholders with your real product photography).

## Adding more languages

1. Drop a new JSON file in `src/locales/langs/`.
2. Register it in `src/locales/i18n.js` (`resources` + `allLangs`).
3. The language popover picks it up automatically.

## What's *not* in scope (yet)

- No backend. Orders are not persisted; the tracking ID is generated client-side.
- No online payment. COD only.
- No email/SMS sending. The next-steps screen is informational.
- No cart. Single product, single line item.
