import type { Skill, SkillCategory } from '@/types/content';

/** Tech stack groups, in display order. Empty groups are hidden. */
export const skillCategories: { key: SkillCategory; label: string }[] = [
  { key: 'languages', label: 'Languages' },
  { key: 'frontend', label: 'Frontend' },
  { key: 'database', label: 'Database' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'ai', label: 'AI-Assisted Development' },
  { key: 'design', label: 'Design Tools' },
  { key: 'infra', label: 'Infrastructure & Tools' },
];

/** ✏️ Add or remove technologies here. */
const stack: Record<SkillCategory, string[]> = {
  languages: ['Java', 'JavaScript', 'TypeScript', 'C#', 'C++', 'Python', 'SQL', 'PHP'],
  frontend: ['React', 'React Native (Expo)', 'Next.js', 'Java Swing', 'HTML', 'CSS', 'Tailwind CSS'],
  database: ['MySQL', 'PostgreSQL'],
  analytics: ['Power BI', 'Tableau', 'KNIME', 'Data Modeling', 'Forecasting'],
  ai: ['Claude Code', 'OpenCode'],
  design: ['Figma'],
  infra: ['Git / GitHub', 'Vercel', 'XAMPP', 'Windows', 'Basic Networking'],
};

export const skills: Skill[] = skillCategories.flatMap((c) =>
  stack[c.key].map((name) => ({ category: c.key, name })),
);
