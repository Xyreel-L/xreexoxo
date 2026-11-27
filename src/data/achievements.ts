import type { Achievement, AchievementCategory } from '@/types/content';

/**
 * Categories, in display order. `issuer` + `kind` form the group heading;
 * `note` is an optional line shown under it.
 */
export const achievementCategories: {
  key: AchievementCategory;
  issuer: string;
  kind: string;
  short: string;
  note?: string;
}[] = [
  {
    key: 'national_certification',
    issuer: 'TESDA',
    kind: 'National Certification',
    short: 'TESDA',
  },
  {
    key: 'certification_exam',
    issuer: 'Certiport',
    kind: 'International IT Certification Examinations',
    short: 'Certiport',
    note: 'Certiport administers certification examinations for different credential programs. Official certification credentials are awarded upon meeting the applicable passing requirements.',
  },
  {
    key: 'international_exam',
    issuer: 'PhilNITS',
    kind: 'International IT Examination',
    short: 'PhilNITS',
    note: 'Given through ITPEC, an international IT examination framework.',
  },
  {
    key: 'training',
    issuer: 'Cisco Networking Academy',
    kind: 'Training and Professional Development',
    short: 'Cisco NetAcad',
  },
];

/**
 * ✏️ YEARS ONLY. Do not add exact dates or training hours.
 * To show a certificate: put the image in src/assets/certificates and set
 *   certificate: require('@/assets/certificates/<file>.jpg')
 * Only set `result` (e.g. 'Passed') when you have proof.
 */
export const achievements: Achievement[] = [
  // 1. TESDA — National Certification
  {
    id: 'tesda-css-nc2',
    title: 'Computer Systems Servicing NC II',
    organization: 'Technical Education and Skills Development Authority (TESDA)',
    category: 'national_certification',
    year: 2023,
    credentialType: 'National Qualification',
    description:
      'National qualification covering the installation, configuration, and maintenance of computer systems and networks.',
  },

  // 2. Certiport — certification examinations (no pass status assumed)
  {
    id: 'certiport-data-analytics',
    title: 'Data Analytics',
    organization: 'Certiport',
    category: 'certification_exam',
    year: 2026,
    credentialType: 'Certification Examination',
  },
  {
    id: 'certiport-databases',
    title: 'Databases',
    organization: 'Certiport',
    category: 'certification_exam',
    year: 2025,
    credentialType: 'Certification Examination',
  },
  {
    id: 'certiport-device-config',
    title: 'Device Configuration and Management (Windows 10)',
    organization: 'Certiport',
    category: 'certification_exam',
    year: 2025,
    credentialType: 'Certification Examination',
  },

  // 3. PhilNITS — IT Passport examination
  {
    id: 'philnits-ip',
    title: 'Information Technology Passport (IP) Examination',
    organization: 'Philippine National IT Standards Foundation (PhilNITS)',
    category: 'international_exam',
    year: 2026, // TODO: confirm year
    credentialType: 'International IT Examination',
  },

  // 4. Cisco Networking Academy — course certificates
  ...(
    [
      ['ccna-srwe', 'CCNA: Switching, Routing, and Wireless Essentials'],
      ['network-addressing', 'Network Addressing and Basic Troubleshooting'],
      ['data-analytics-essentials', 'Data Analytics Essentials'],
      ['intro-modern-ai', 'Introduction to Modern AI'],
      ['intro-data-science', 'Introduction to Data Science'],
      ['find-insights-ai', 'Find Insights with AI'],
      ['english-it-1', 'English for IT 1'],
      ['english-it-2', 'English for IT 2'],
      ['ibm-ai-fundamentals', 'AI Fundamentals with IBM SkillsBuild'],
    ] as const
  ).map(
    ([id, title]): Achievement => ({
      id,
      title,
      organization: 'Cisco Networking Academy',
      category: 'training',
      year: 2025,
      credentialType: 'Course Certificate',
    }),
  ),
];
