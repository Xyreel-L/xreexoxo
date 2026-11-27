// Generates the pink & cream favicon/app icon (a rose arch on cream).
// Run once: node scripts/make-icons.js
const Jimp = require('jimp-compact');

const hex = (h, a = 255) => Jimp.rgbaToInt(parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16), a);
const CREAM = hex('#F7EDE3'), ROSE = hex('#D99BAA'), MAUVE = hex('#B8798C'), BLUSH = hex('#EBC5CB');

async function make(size, file, round) {
  const img = new Jimp(size, size, 0x00000000);
  const s = size, r = s / 2;
  img.scan(0, 0, s, s, (x, y, idx) => {
    const cx = x + 0.5, cy = y + 0.5;
    const inBg = round ? Math.hypot(cx - r, cy - r) <= r : true;
    if (!inBg) return;
    let c = round ? CREAM : CREAM;
    // arch: half-circle top + rectangle bottom
    const aw = s * 0.46, ax0 = r - aw / 2, ax1 = r + aw / 2, atop = s * 0.2, abot = s * 0.8, ar = aw / 2;
    const archCy = atop + ar;
    const inArch = cx >= ax0 && cx <= ax1 && cy <= abot && (cy >= archCy || Math.hypot(cx - r, cy - archCy) <= ar);
    if (inArch) c = cy > s * 0.58 ? MAUVE : ROSE;
    // small blush dot
    if (Math.hypot(cx - s * 0.72, cy - s * 0.3) <= s * 0.07) c = BLUSH;
    img.bitmap.data.writeUInt32BE(c >>> 0, idx);
  });
  await img.writeAsync(file);
  console.log('wrote', file);
}

(async () => {
  await make(48, 'assets/favicon.png', true);
  await make(1024, 'assets/icon.png', false);
  await make(512, 'public/apple-touch-icon.png', false);
})();
