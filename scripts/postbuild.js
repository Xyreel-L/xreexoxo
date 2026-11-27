// Runs after `expo export -p web`.
// Vercel serves dist/404.html for unknown URLs, so copy Expo's not-found page there.
const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, '..', 'dist');
const notFound = path.join(dist, '+not-found.html');

if (!fs.existsSync(notFound)) {
  console.error('postbuild: dist/+not-found.html is missing — did the export fail?');
  process.exit(1);
}
fs.copyFileSync(notFound, path.join(dist, '404.html'));
console.log('postbuild: wrote dist/404.html');
