# sertaccan.com

Sertac Can'in kisisel portfolyo sitesi. Koyu temali, terminal esintili tasarim, TR/EN dil destegi.

**Canli:** [sertaccan.com](https://sertaccan.com)

[English](../README.md)

## Teknoloji Yigini

| Katman | Teknoloji |
|--------|-----------|
| Framework | SvelteKit (TypeScript) |
| Stil | Tailwind CSS v4 |
| i18n | Paraglide (TR / EN) |
| ORM | Prisma |
| Veritabani | PostgreSQL |
| Auth | Better Auth |
| Validasyon | Zod |
| Deploy | Docker + VPS (Traefik) |
| CI/CD | GitHub Actions |

## Ozellikler

- Tek sayfa landing, bolumler arasi akici gecis (Hero, Hakkimda, Teknolojiler, Projeler, Iletisim)
- Proje listeleme ve detay sayfalari (markdown destekli)
- Admin paneli ile proje yonetimi (CRUD)
- Responsive tasarim, mobil hamburger menu
- Koyu/acik tema gecisi
- SEO optimizasyonu (canonical, hreflang, OG/Twitter meta tag'leri, sitemap.xml)
- Sayfa gecis animasyonlari (View Transitions API)

## Baslangic

### Gereksinimler

- Node.js 24+
- Docker & Docker Compose

### Yerel Gelistirme (Docker ile)

```bash
# Repoyu klonla
git clone https://github.com/SertacN/sertaccan.com.git
cd sertaccan.com

# .env dosyasini olustur
cp .env.example .env
# Degerleri doldur

# Gelistirme ortamini baslat
docker compose -f docker-compose.dev.yml up -d

# Migration'lari calistir
docker compose -f docker-compose.dev.yml exec app npx prisma migrate dev

# http://localhost:5173 adresini ac
```

### Yerel Gelistirme (Docker olmadan)

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

### Faydali Komutlar

```bash
# Prisma Studio (DB arayuzu)
npx prisma studio

# Production build
npm run build

# Tip kontrolu
npm run check

# Lint
npm run lint
```

## Deploy

Proje `main` branch'e push yapildiginda GitHub Actions ile otomatik deploy edilir. Workflow VPS'e SSH ile baglanip su komutlari calistirir:

```bash
git pull origin main
docker compose --env-file .env up -d --build
```

### Ortam Degiskenleri

Gerekli degiskenler icin [.env.example](.env.example) dosyasina bakin.

## Lisans

MIT
