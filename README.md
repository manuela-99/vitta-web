# Vitta Web

## Checkout y pedidos (Supabase)

Para que el checkout registre pedidos y abra WhatsApp, ejecutá **todo** el script en Supabase:

`supabase/admin-policies.sql` → SQL Editor → Run

Incluye permisos de esquema, RLS y la función `create_public_order` que usa el frontend.

### Variables de entorno

Copiá `.env.example` a `.env.local` y completá:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Opcional en **Vercel** (respaldo en producción):

- `SUPABASE_SERVICE_ROLE_KEY` — Settings → API → service_role (secret)

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
