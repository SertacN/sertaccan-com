export interface Tech {
	name: string;
	category: 'Frontend' | 'Backend' | 'DevOps' | 'Database' | 'Mobile';
	level: 'beginner' | 'intermediate' | 'advanced';
}

export const techstack: Tech[] = [
	// Frontend
	{ name: 'Angular', category: 'Frontend', level: 'advanced' },
	{ name: 'NextJS', category: 'Frontend', level: 'intermediate' },
	{ name: 'SvelteKit', category: 'Frontend', level: 'beginner' },
	{ name: 'TypeScript', category: 'Frontend', level: 'advanced' },
	{ name: 'HTML/CSS', category: 'Frontend', level: 'advanced' },

	// Backend
	{ name: 'NestJS', category: 'Backend', level: 'advanced' },
	{ name: 'Prisma', category: 'Backend', level: 'intermediate' },

	// Database
	{ name: 'PostgreSQL', category: 'Database', level: 'advanced' },
	{ name: 'Redis', category: 'Database', level: 'intermediate' },

	// DevOps
	{ name: 'Docker', category: 'DevOps', level: 'advanced' },
	{ name: 'GitHub Actions', category: 'DevOps', level: 'intermediate' },
	{ name: 'Traefik', category: 'DevOps', level: 'intermediate' },
	{ name: 'Linux', category: 'DevOps', level: 'intermediate' },

	// Mobile
	{ name: 'React Native Expo', category: 'Mobile', level: 'intermediate' }
];
