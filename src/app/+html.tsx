import type { PropsWithChildren, ReactNode } from 'react';
import { ScrollViewStyleReset } from 'expo-router/html';
import { profile } from '@/data/profile';
import { site } from '@/constants/site';

/**
 * Root HTML for the static web export (runs in Node at build time only).
 * Holds SEO + Open Graph tags and loads the web fonts.
 */
export default function Root({
  children,
  headNodes,
  bodyNodes,
}: PropsWithChildren<{ headNodes?: ReactNode; bodyNodes?: ReactNode }>) {
  const title = `${profile.fullName} — ${site.shortTitle}`;
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />
        <title>{title}</title>
        <meta name="description" content={site.description} />
        <meta name="author" content={profile.fullName} />
        <meta name="theme-color" content="#F7EDE3" />
        <link rel="canonical" href={site.url} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={site.description} />
        <meta property="og:url" content={site.url} />
        <meta property="og:image" content={`${site.url}${site.ogImage}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={site.description} />
        <meta name="twitter:image" content={`${site.url}${site.ogImage}`} />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Manrope:wght@400;500;600;700&display=swap"
        />

        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: globalCss }} />
        {headNodes}
      </head>
      <body>
        {children}
        {bodyNodes}
      </body>
    </html>
  );
}

const globalCss = `
html, body { background-color: #F7EDE3; }
body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
::selection { background: #EBC5CB; color: #40333A; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
}
`;
