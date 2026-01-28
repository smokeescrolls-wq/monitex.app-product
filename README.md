# Monitex (Next.js 16)

App Next.js 16 (App Router) com TailwindCSS v4, shadcn/ui, Zod, Zustand e TypeScript.

## Requisitos

- Node.js 20+
- pnpm 9+

## Rodar

```bash
pnpm install
pnpm dev
```

## Variáveis de ambiente

Copie `.env.example` para `.env` e ajuste.

- `UPSTREAM_BASE_URL` (default `https://stalkea.ai/api/v1`)
- `NEXT_PUBLIC_CHECKOUT_URL`
- `MOBILE_ONLY` (`true` para restringir a mobile)
- `ALLOWED_IMAGE_HOSTS` (opcional, lista por vírgula)

## Testes

Unit + integração (Vitest):

```bash
pnpm test
```

E2E (Playwright):

```bash
pnpm test:e2e
```

Obs.: Playwright pode exigir instalar browsers:

```bash
pnpm exec playwright install
```

## Segurança (resumo)

- Rate limiting in-memory nas rotas `/api/*`.
- Sem `dangerouslySetInnerHTML` para renderização de texto.
- Proxy de imagem com guardas SSRF.
- Security headers via `next.config.mjs`.
