import type { Project } from '@/types/content';

/**
 * ✏️ Add new projects to this list. Only include technologies, features, and links
 * that match the real implementation.
 * Thumbnail: put an image in src/assets/projects and set
 *   thumbnail: require('@/assets/projects/<file>.png')
 */
export const projects: Project[] = [
  {
    id: 'icare-plus-plus',
    name: 'iCARE++: A Scalable Machine Learning-Driven Clinical Competency Assessment and Adaptive Learning System for Nursing Students',
    shortName: 'iCARE++',
    description:
      'An academic software project focused on clinical competency assessment, adaptive learning, and performance monitoring for nursing students.',
    problem: undefined, // TODO
    solution: undefined, // TODO
    technologies: [], // TODO: e.g. ['React Native', 'Expo', 'Python'] — only what iCARE++ really uses
    keyFeatures: [], // TODO
    role: undefined, // TODO: your role, e.g. 'Full-stack developer'
    contributions: [], // TODO
    status: undefined, // TODO: 'In progress' | 'Completed' ...
    githubUrl: undefined, // TODO: only if the repository is public
    liveUrl: undefined,
    featured: true,
  },
];
