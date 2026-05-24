# Propiedades Sosa

Sitio web de Propiedades Sosa construido con SitioHoy.

- **Plan:** Esencial
- **Slug:** propiedades-sosa
- **Stack:** Next.js + TypeScript + Tailwind + Supabase + Vercel

## Setup local

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Copiar `.env.local.example` a `.env.local` y completar las variables.

3. Correr en desarrollo:
   ```bash
   npm run dev
   ```

4. Build de producción:
   ```bash
   npm run build
   ```

## Estructura

- `app/` — rutas y páginas (App Router)
- `lib/` — utilidades compartidas (Supabase, helpers)
- `proxy.ts` — middleware de sesión Supabase (NO `middleware.ts`)
- `scripts/setup-rls.sql` — políticas RLS para Supabase (ejecutar una sola vez en el SQL Editor de Supabase)
- `skills/` — documentación de skills de SitioHoy (referencia interna)

## Base de datos

Ejecutar en Supabase SQL Editor en este orden:

1. `scripts/setup-rls.sql` — crea el tenant y configura RLS
2. Copiar el UUID del tenant que imprime el script → pegarlo en `.env.local` como `NEXT_PUBLIC_TENANT_ID`

## Deploy

Deploy en Vercel:
- Conectar el repo
- Configurar las variables de entorno
- Configurar el dominio en Cloudflare apuntando a Vercel

## Soporte

Cualquier consulta: [SitioHoy](https://sitiohoy.com.ar)
