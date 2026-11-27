import type { Skill, SkillCategory } from '@/types/content';

export const skillCategories: { key: SkillCategory; label: string }[] = [
  { key: 'programming', label: 'Programming and Software Development' },
  { key: 'database', label: 'Database Management' },
  { key: 'networking', label: 'Networking and Infrastructure' },
  { key: 'data_analytics', label: 'Data Analytics' },
  { key: 'ai', label: 'Artificial Intelligence' },
  { key: 'systems', label: 'Computer Systems and Operating Systems' },
  { key: 'tools', label: 'Development Tools' },
];

/**
 * ✏️ Only list skills you are confident about. Categories with no skills are hidden.
 * `level` is optional and never shown as a percentage.
 *
 * TODO: confirm this starter list — it is based on your own GitHub repositories,
 * your TESDA certification, and your CCNA coursework.
 */
export const skills: Skill[] = [
  { category: 'programming', name: 'React Native', description: 'Cross-platform mobile and web interfaces with React Native and Expo.' },
  { category: 'programming', name: 'TypeScript / JavaScript', description: 'Building typed, component-based application code.' },
  { category: 'database', name: 'SQL and Relational Databases', description: 'Designing tables and writing queries for application data.' },
  { category: 'database', name: 'Supabase', description: 'PostgreSQL database, authentication, and storage for app backends.' },
  { category: 'networking', name: 'Routing and Switching', description: 'Configuring switches, routers, and wireless networks.' },
  { category: 'networking', name: 'Network Addressing', description: 'IPv4 addressing, subnetting, and basic troubleshooting.' },
  { category: 'systems', name: 'Computer Systems Servicing', description: 'Assembling, maintaining, and troubleshooting computer hardware.' },
  { category: 'systems', name: 'Windows Configuration', description: 'Installing, configuring, and managing Windows devices.' },
  { category: 'tools', name: 'Git and GitHub', description: 'Version control, branching, and collaborating through repositories.' },
  { category: 'tools', name: 'VS Code', description: 'Primary editor and development environment.' },
];
