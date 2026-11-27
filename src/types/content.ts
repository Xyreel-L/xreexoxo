/** A local image: the value returned by require('@/assets/...'). */
type LocalImage = number;

export type LinkItem = { label: string; url: string };

export type Profile = {
  fullName: string;
  professionalTitle: string;
  tagline: string;
  /** Short paragraphs shown in About Me. */
  biography: string[];
  degreeProgram: string;
  university: string;
  yearLevel?: string;
  location?: string;
  technicalInterests: string[];
  careerInterests: string[];
  /** Put the photo in assets/images and require() it here. */
  photo?: LocalImage;
  /** Path under /public, e.g. '/resume.pdf'. Leave undefined to hide the button. */
  resumeUrl?: string;
  email: string;
  linkedinUrl?: string;
  githubUrl?: string;
  otherLinks: LinkItem[];
  availableForOjt: boolean;
};

export type SkillCategory =
  | 'programming'
  | 'database'
  | 'networking'
  | 'data_analytics'
  | 'ai'
  | 'systems'
  | 'tools';

export type Skill = {
  category: SkillCategory;
  name: string;
  description: string;
  /** Optional, set manually. Never shown as a percentage. */
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
};

export type AchievementCategory =
  | 'professional_certification'
  | 'technical_examination'
  | 'technical_training'
  | 'additional_learning';

export type Achievement = {
  id: string;
  title: string;
  organization?: string;
  category: AchievementCategory;
  /** YEAR ONLY. Exact dates and training hours are intentionally not modelled. */
  year: number;
  credentialType?: string;
  /** Only set when you have proof, e.g. 'Passed'. Never assumed. */
  result?: string;
  description?: string;
  /** require('../../assets/certificates/xxx.jpg') */
  certificate?: LocalImage;
  verificationUrl?: string;
};

export type ProjectStatus = 'Planning' | 'In progress' | 'Completed' | 'Archived';

export type Project = {
  id: string;
  name: string;
  shortName?: string;
  description: string;
  problem?: string;
  solution?: string;
  technologies: string[];
  keyFeatures: string[];
  role?: string;
  contributions?: string[];
  status?: ProjectStatus;
  thumbnail?: LocalImage;
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
};

export type Education = {
  id: string;
  institution: string;
  degree?: string;
  period?: string;
  description?: string;
  logo?: LocalImage;
};
