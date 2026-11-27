import type { Profile } from '@/types/content';

/**
 * ✏️ EDIT THIS FILE to update your personal information.
 * Anything marked TODO still needs your real details.
 */
export const profile: Profile = {
  fullName: 'Xyreel Laguras', // TODO: confirm full name as you want it shown
  professionalTitle: 'Information Technology Student · Aspiring Software Developer', // TODO: confirm
  tagline:
    'Turning ideas into meaningful digital solutions through technology, creativity, and continuous learning.',
  biography: [
    // TODO: replace with your own words — this draft only uses facts already known.
    'I am an Information Technology student at Batangas State University who learns best by building. My coursework and certifications have taken me from servicing computer hardware to configuring networks, designing databases, and developing cross-platform applications.',
    'Lately my focus has been on software and data: building mobile and web apps with React Native, working with relational databases, and exploring how machine learning and analytics can support better decisions — the direction behind our capstone project, iCARE++.',
    'I am preparing for my on-the-job training and looking for a team where I can contribute, ask good questions, and keep growing as a developer.',
  ],
  degreeProgram: 'Bachelor of Science in Information Technology', // TODO: confirm exact program name
  university: 'Batangas State University',
  yearLevel: undefined, // TODO: e.g. '4th Year'
  location: undefined, // TODO: e.g. 'Batangas, Philippines'
  technicalInterests: [
    'Software Development',
    'Database Systems',
    'Data Analytics',
    'Machine Learning',
    'Networking',
  ],
  careerInterests: ['Software Development', 'Data Analytics', 'IT Support and Systems'], // TODO: confirm
  // Formal photo shown in the hero arch.
  photo: require('@/assets/images/profile.jpg'),
  resumeUrl: undefined, // TODO: add public/resume.pdf (project root) then set to '/resume.pdf'
  email: 'lagurascx@gmail.com',
  linkedinUrl: undefined, // TODO: your LinkedIn URL
  githubUrl: 'https://github.com/Xyreel-L',
  otherLinks: [],
  availableForOjt: true,
};
