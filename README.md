# sertaccan.com

Personal portfolio website of Sertac Can. Dark-themed, terminal-inspired design with TR/EN language support.

**Live:** [sertaccan.com](https://sertaccan.com)

[Türkçe](docs/README.tr.md)

## Tech Stack

| Layer      | Technology              |
| ---------- | ----------------------- |
| Framework  | Next.js 15 (TypeScript) |
| Styling    | Tailwind CSS v4         |
| i18n       | next-intl (TR / EN)     |
| ORM        | Drizzle ORM             |
| Database   | PostgreSQL              |
| Auth       | Better Auth             |
| Validation | Zod                     |
| Deploy     | Docker + VPS (Traefik)  |
| CI/CD      | GitHub Actions          |

## Features

- Single-page landing with smooth scroll sections (Hero, About, Tech Stack, Projects, Contact)
- Project listing with detail pages and markdown rendering
- Admin panel with authentication (CRUD for projects, contact form management, user management)
- Contact form with rate limiting
- Responsive design with mobile menu
- Dark/light theme toggle
- SEO optimized (canonical, hreflang, OG/Twitter meta tags, sitemap.xml)

## Getting Started

### Prerequisites

- Node.js 22+
- Docker & Docker Compose

### Local Development (with Docker)

```bash
# Clone the repo
git clone https://github.com/sertaccan/sertaccan-next.git
cd sertaccan-next

# Create .env from example
cp .env.example .env
# Fill in the values (use localhost for DATABASE_URL in local dev)

# Start dev environment
docker compose -f docker-compose.dev.yml up -d

# Open http://localhost:3000
```

### Local Development (without Docker)

```bash
npm install
npm run db:migrate
npm run dev
```

## Useful Commands

```bash
# Run database migrations
npm run db:migrate

# Open Drizzle Studio (DB GUI)
npm run db:studio

# Generate migration files after schema changes
npm run db:generate

# Build for production
npm run build

# Lint
npm run lint
```

## Deployment

The project auto-deploys on push to `main` via GitHub Actions. The workflow SSHs into the VPS and runs:

```bash
cd /opt/sertaccan-com
git pull origin main
docker compose --env-file .env up -d --build
docker image prune -f
```

Database migrations run automatically during the Docker build step.

### Required GitHub Secrets

| Secret        | Description                        |
| ------------- | ---------------------------------- |
| `VPS_HOST`    | VPS IP address or hostname         |
| `VPS_SSH_KEY` | Private SSH key for VPS access     |

### Environment Variables

See [.env.example](.env.example) for all required variables.

> **Note:** On the VPS, `DATABASE_URL` must use `postgres` as the host (the container name), and `BETTER_AUTH_URL` must be the production URL (`https://sertaccan.com`).

## License

MIT
