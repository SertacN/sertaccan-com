import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL!
});
const prisma = new PrismaClient({ adapter });

async function main() {
	const project = await prisma.project.create({
		data: {
			slug: 'ornek-proje',
			title: 'Örnek Proje',
			descriptionTr:
				'Bu bir örnek projedir. Markdown desteğini test etmek için oluşturulmuştur.',
			descriptionEn: 'This is a sample project. Created to test markdown support.',
			longDescriptionTr: `# Örnek Proje

Bu proje **markdown desteğini** göstermek için oluşturulmuştur.

## Özellikler

- **Kullanıcı yönetimi** — Kayıt, giriş, profil düzenleme
- **Dashboard** — Gerçek zamanlı istatistikler
- **API** — RESTful endpoint'ler

## Kullanılan Teknolojiler

| Teknoloji | Açıklama |
|-----------|----------|
| SvelteKit | Full-stack framework |
| PostgreSQL | Veritabanı |
| Prisma | ORM |
| Docker | Container |

## Kurulum

\`\`\`bash
git clone https://github.com/SertacN/ornek-proje.git
cd ornek-proje
npm install
npm run dev
\`\`\`

## Notlar

> Bu kısımda normalde ekran görüntüsü olurdu.

Inline kod: \`npm run dev\` komutu ile çalıştırın.

---

Daha fazla bilgi için [GitHub reposunu](https://github.com/SertacN) ziyaret edin.`,
			longDescriptionEn: `# Sample Project

This project was created to demonstrate **markdown support**.

## Features

- **User management** — Register, login, profile editing
- **Dashboard** — Real-time statistics
- **API** — RESTful endpoints

## Tech Stack

| Technology | Description |
|------------|-------------|
| SvelteKit | Full-stack framework |
| PostgreSQL | Database |
| Prisma | ORM |
| Docker | Container |

## Installation

\`\`\`bash
git clone https://github.com/SertacN/ornek-proje.git
cd ornek-proje
npm install
npm run dev
\`\`\`

## Notes

> This is where a screenshot would normally go.

Inline code: Run with \`npm run dev\`.

---

For more info, visit the [GitHub repo](https://github.com/SertacN).`,
			tags: ['SvelteKit', 'TypeScript', 'PostgreSQL', 'Prisma', 'Docker'],
			githubUrl: 'https://github.com/SertacN',
			liveUrl: '',
			status: 'ACTIVE',
			featured: true,
			order: 1,
			isActive: true
		}
	});
	console.log('Created:', project.slug, project.id);
}

main().finally(() => prisma.$disconnect());
