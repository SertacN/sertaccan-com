# sertaccan.com

Sertaç Can'ın kişisel portföy web sitesi. Karanlık tema, terminal esinli tasarım ve TR/EN dil desteği.

**Canlı:** [sertaccan.com](https://sertaccan.com)

[English](../README.md)

## Teknoloji Yığını

| Katman      | Teknoloji               |
| ----------- | ----------------------- |
| Framework   | Next.js 15 (TypeScript) |
| Stil        | Tailwind CSS v4         |
| i18n        | next-intl (TR / EN)     |
| ORM         | Drizzle ORM             |
| Veritabanı  | PostgreSQL              |
| Auth        | Better Auth             |
| Validasyon  | Zod                     |
| Deploy      | Docker + VPS (Traefik)  |
| CI/CD       | GitHub Actions          |

## Özellikler

- Düzgün kaydırmalı bölümler içeren tek sayfa landing (Hero, Hakkında, Teknolojiler, Projeler, İletişim)
- Proje listesi, detay sayfaları ve markdown render
- Kimlik doğrulamalı admin paneli (proje CRUD, iletişim formu yönetimi, kullanıcı yönetimi)
- Rate limiting'li iletişim formu
- Mobil menü ile responsive tasarım
- Karanlık/aydınlık tema geçişi
- SEO optimizasyonu (canonical, hreflang, OG/Twitter meta etiketleri, sitemap.xml)

## Başlarken

### Gereksinimler

- Node.js 22+
- Docker & Docker Compose

### Lokal Geliştirme (Docker ile)

```bash
# Repoyu klonla
git clone https://github.com/sertaccan/sertaccan-next.git
cd sertaccan-next

# .env dosyasını oluştur
cp .env.example .env
# Değerleri doldur (lokal geliştirme için DATABASE_URL'de localhost kullan)

# Geliştirme ortamını başlat
docker compose -f docker-compose.dev.yml up -d

# http://localhost:3000 adresini aç
```

### Lokal Geliştirme (Docker'sız)

```bash
npm install
npm run db:migrate
npm run dev
```

## Faydalı Komutlar

```bash
# Veritabanı migrasyonlarını çalıştır
npm run db:migrate

# Drizzle Studio'yu aç (DB arayüzü)
npm run db:studio

# Şema değişikliklerinden sonra migrasyon dosyası oluştur
npm run db:generate

# Production build
npm run build

# Lint
npm run lint
```

## Deployment

Proje, `main` branch'e her push'ta GitHub Actions aracılığıyla otomatik deploy edilir. Workflow VPS'e SSH bağlanarak şunu çalıştırır:

```bash
cd /opt/sertaccan-com
git pull origin main
docker compose --env-file .env up -d --build
docker image prune -f
```

Veritabanı migrasyonları Docker build adımında otomatik olarak uygulanır.

### Gerekli GitHub Secrets

| Secret        | Açıklama                        |
| ------------- | ------------------------------- |
| `VPS_HOST`    | VPS IP adresi veya host adı     |
| `VPS_SSH_KEY` | VPS erişimi için özel SSH anahtarı |

### Ortam Değişkenleri

Gerekli tüm değişkenler için [.env.example](../.env.example) dosyasına bakın.

> **Not:** VPS'te `DATABASE_URL` host olarak `postgres` (container adı) kullanmalıdır ve `BETTER_AUTH_URL` production URL'si olmalıdır (`https://sertaccan.com`).

## Lisans

MIT
