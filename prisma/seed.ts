import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from 'dotenv';

config({ path: '.env' });
config({ path: '.env.local', override: true });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
	const email = process.env.ADMIN_EMAIL;
	const password = process.env.ADMIN_PASSWORD;

	if (!email || !password) {
		throw new Error('ADMIN_EMAIL ve ADMIN_PASSWORD .env dosyasında tanımlı olmalı');
	}

	const existing = await prisma.user.findUnique({ where: { email } });
	if (existing) {
		console.log(`Admin zaten mevcut: ${email}`);
		return;
	}

	const response = await fetch(`${process.env.BETTER_AUTH_URL}/api/auth/sign-up/email`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Origin: process.env.BETTER_AUTH_URL!
		},
		body: JSON.stringify({ email, password, name: 'Admin' })
	});

	if (!response.ok) {
		throw new Error(`Kullanıcı oluşturulamadı: ${await response.text()}`);
	}

	await prisma.user.update({
		where: { email },
		data: { role: 'admin' }
	});

	console.log(`✓ Admin oluşturuldu: ${email}`);
}

main()
	.catch(console.error)
	.finally(() => prisma.$disconnect());
