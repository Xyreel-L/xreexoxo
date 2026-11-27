# xreexoxo — IT Portfolio

Personal portfolio of Xyreel Laguras, an Information Technology student at Batangas State University.

**Live:** https://xreexoxo.vercel.app

It is a static website built with **React Native, Expo, React Native Web, TypeScript, and Expo Router**. There is no backend, database, or login. All content lives in TypeScript files inside this repository.

## Editing content

All public content is in `src/data/`:

| File | What it holds |
| --- | --- |
| `src/data/profile.ts` | Name, title, tagline, biography, email, links, photo, résumé |
| `src/data/skills.ts` | Technical skills by category (empty categories are hidden) |
| `src/data/achievements.ts` | Certifications, examinations, trainings, courses |
| `src/data/projects.ts` | Project showcase (featured project + others) |
| `src/data/education.ts` | Education timeline |
| `src/constants/site.ts` | SEO title, description, site URL |

Search for `TODO` to find details that still need your input.

### Rules for achievements
- Show **years only**. Do not add exact dates or training hours.
- Only set `result: 'Passed'` when you have proof.
- Do not create or edit certificate images. Use only the real ones.

### Adding images and files
| What | Put it in | Then set |
| --- | --- | --- |
| Profile photo | `src/assets/images/profile.jpg` | `photo: require('@/assets/images/profile.jpg')` in `profile.ts` |
| Certificate | `src/assets/certificates/<name>.jpg` | `certificate: require('@/assets/certificates/<name>.jpg')` on that achievement |
| Project thumbnail | `src/assets/projects/<name>.png` | `thumbnail: require('@/assets/projects/<name>.png')` |
| Résumé PDF | `public/resume.pdf` | `resumeUrl: '/resume.pdf'` in `profile.ts` (the **Download Resume** button shows only when this is set) |

Compress images before adding them. Aim for under ~300 KB each and about 1600 px wide for certificates. https://squoosh.app works well.

## Local development

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run web          # dev server → http://localhost:8081
npm run typecheck    # TypeScript check
npm run build        # static export → dist/
npx serve dist       # preview the production build
```

## Deployment (Vercel, free tier)

`vercel.json` already configures the build:

- Build command: `npm run build`, which runs `expo export -p web` and then copies the 404 page.
- Output directory: `dist`
- Framework preset: none

The GitHub repository is connected to the Vercel project **xreexoxo**, so every push to `main` deploys automatically. To deploy by hand:

```bash
npx vercel --prod
```

## Project structure

```
src/
├── app/            # Expo Router routes: index, +not-found, _layout, +html (SEO head)
├── components/     # navigation, hero, about, skills, achievements, projects, education, contact, ui
├── data/           # ✏️ all portfolio content
├── assets/         # images, certificates, project thumbnails
├── constants/      # navigation items, site/SEO settings
├── hooks/          # responsive breakpoints
├── theme/          # colors, spacing, typography tokens
├── types/          # content types
└── utils/          # links, mailto, downloads
public/             # files served as-is (résumé PDF, touch icon)
scripts/            # build helpers
```

## Design tokens

| Token | Hex | Use |
| --- | --- | --- |
| Dusty Rose | `#D99BAA` | Primary accent |
| Soft Blush | `#EBC5CB` | Secondary accent |
| Warm Cream | `#F7EDE3` | Page background |
| Ivory White | `#FFF9F4` | Cards and surfaces |
| Muted Mauve | `#B8798C` | Buttons, links, highlights |
| Deep Plum | `#40333A` | Headings and text |

Typefaces: **Fraunces** for headings and **Manrope** for body text, both from Google Fonts.
