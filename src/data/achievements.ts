import type { Achievement, AchievementCategory } from '@/types/content';

export const achievementCategories: { key: AchievementCategory; label: string; short: string }[] = [
  { key: 'professional_certification', label: 'Professional Certifications', short: 'Certifications' },
  { key: 'technical_examination', label: 'Technical Examinations', short: 'Examinations' },
  { key: 'technical_training', label: 'Technical Training and Course Certificates', short: 'Training' },
  { key: 'additional_learning', label: 'Additional Learning', short: 'Additional Learning' },
];

/**
 * ✏️ YEARS ONLY. Do not add exact dates or training hours.
 * To show a certificate: put the image in src/assets/certificates and set
 *   certificate: require('@/assets/certificates/<file>.jpg')
 * Only set `result` (e.g. 'Passed') when you have proof.
 */
export const achievements: Achievement[] = [
  // A. Professional certification
  {
    id: 'tesda-css-nc2',
    title: 'Computer Systems Servicing NC II',
    organization: 'Technical Education and Skills Development Authority (TESDA)',
    category: 'professional_certification',
    year: 2023,
    credentialType: 'National Certificate',
    description:
      'National certification covering the installation, configuration, and maintenance of computer systems and networks.',
  },

  // B. PhilNITS IT Specialist examinations — records only, no pass status assumed
  {
    id: 'philnits-databases',
    title: 'IT Specialist Examination: Databases',
    organization: 'Philippine National IT Standards Foundation (PhilNITS)',
    category: 'technical_examination',
    year: 2025,
    credentialType: 'Examination',
  },
  {
    id: 'philnits-device-config',
    title: 'IT Specialist Examination: Device Configuration and Management (Windows 10)',
    organization: 'Philippine National IT Standards Foundation (PhilNITS)',
    category: 'technical_examination',
    year: 2025,
    credentialType: 'Examination',
  },
  {
    id: 'philnits-data-analytics',
    title: 'IT Specialist Examination: Data Analytics',
    organization: 'Philippine National IT Standards Foundation (PhilNITS)',
    category: 'technical_examination',
    year: 2026,
    credentialType: 'Examination',
  },

  // C. Technical training
  {
    id: 'ccna-srwe',
    title: 'CCNA: Switching, Routing, and Wireless Essentials',
    organization: 'Batangas State University',
    category: 'technical_training',
    year: 2025,
    credentialType: 'Course Certificate',
  },
  {
    id: 'data-analytics-essentials',
    title: 'Data Analytics Essentials',
    category: 'technical_training',
    year: 2025,
    credentialType: 'Course Certificate',
  },
  {
    id: 'ibm-ai-fundamentals',
    title: 'AI Fundamentals with IBM SkillsBuild',
    organization: 'IBM SkillsBuild',
    category: 'technical_training',
    year: 2025,
    credentialType: 'Course Certificate',
  },
  {
    id: 'network-addressing',
    title: 'Network Addressing and Basic Troubleshooting',
    organization: 'Networking Academy',
    category: 'technical_training',
    year: 2025,
    credentialType: 'Course Certificate',
  },

  // D. Additional learning
  { id: 'intro-modern-ai', title: 'Introduction to Modern AI', category: 'additional_learning', year: 2025, credentialType: 'Course Completion' },
  { id: 'intro-data-science', title: 'Introduction to Data Science', category: 'additional_learning', year: 2025, credentialType: 'Course Completion' },
  { id: 'find-insights-ai', title: 'Find Insights with AI', category: 'additional_learning', year: 2025, credentialType: 'Course Completion' },
  { id: 'english-it-1', title: 'English for IT 1', category: 'additional_learning', year: 2025, credentialType: 'Course Completion' },
  { id: 'english-it-2', title: 'English for IT 2', category: 'additional_learning', year: 2025, credentialType: 'Course Completion' },
];
