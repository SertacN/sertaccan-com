# sertaccan.com

Personal portfolio website of Sertac Can. Dark-themed, terminal-inspired design with TR/EN language support.

**Live:** [sertaccan.com](https://sertaccan.com)

[Turkce](docs/README.tr.md)

## Tech Stack

| Layer      | Technology             |
| ---------- | ---------------------- |
| Framework  | SvelteKit (TypeScript) |
| Styling    | Tailwind CSS v4        |
| i18n       | Paraglide (TR / EN)    |
| ORM        | Prisma                 |
| Database   | PostgreSQL             |
| Auth       | Better Auth            |
| Validation | Zod                    |
| Deploy     | Docker + VPS (Traefik) |
| CI/CD      | GitHub Actions         |

## Features

- Single-page landing with smooth scroll sections (Hero, About, Tech Stack, Projects, Contact)
- Project listing with detail pages and markdown rendering
- Admin panel with authentication (CRUD for projects)
- Responsive design with mobile hamburger menu
- Dark/light theme toggle
- SEO optimized (canonical, hreflang, OG/Twitter meta tags, sitemap.xml)
- Page transition animations (View Transitions API)

## Getting Started

### Prerequisites

- Node.js 24+
- Docker & Docker Compose

### Local Development (with Docker)

```bash
# Clone the repo
git clone https://github.com/SertacN/sertaccan.com.git
cd sertaccan.com

# Create .env from example
cp .env.example .env
# Fill in the values

# Start dev environment
docker compose -f docker-compose.dev.yml up -d

# Run migrations
docker compose -f docker-compose.dev.yml exec app npx prisma migrate dev

# Open http://localhost:5173
```

### Local Development (without Docker)

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

### Useful Commands

```bash
# Prisma Studio (DB GUI)
npx prisma studio

# Build for production
npm run build

# Type check
npm run check

# Lint
npm run lint
```

## Deployment

The project auto-deploys on push to `main` via GitHub Actions. The workflow SSHs into the VPS and runs:

```bash
git pull origin main
docker compose --env-file .env up -d --build
```

### Environment Variables

See [.env.example](.env.example) for required variables.

## License

MIT
