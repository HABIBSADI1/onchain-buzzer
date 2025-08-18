# FinalClick Frame + Mini App Server

A minimal, production-safe Express + TypeScript server that serves:
- A Farcaster **Frame vNext** at `/frame` (no transactions; one POST button).
- A dynamic SVG image at `/frame-image/svg` (no native deps).
- An experimental **Mini App** manifest and action endpoints under `/miniapp`.

## Quick start (local)

```bash
npm ci
npm run dev
# open http://localhost:8080/frame
```

## Deploy (Railway/Docker)

Build runs with dev deps (for types), then prunes in the runtime image.

Set the env var:

- `PUBLIC_BASE_URL=https://frame.finalclick.xyz`

## Verify

```bash
# frame meta must include ONLY post_url (no tx/data/value)
curl -s https://frame.finalclick.xyz/frame |   grep -E 'fc:frame:(post_url|image|button:1)'
```

Mini app manifest (optional):

```bash
curl -s https://frame.finalclick.xyz/miniapp/manifest.json | jq .
```

## Notes

- Replace `public/.well-known/farcaster.json` with your real values.
- If you don't use the Mini App tile, you can ignore `/miniapp/*` completely.
