import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Clean SVG for the icon with deep navy/slate background and stylish invoice / prism emblem
const createSvg = ({ paddingRatio = 0, bgColor = '#0f172a' }) => {
  const size = 512;
  const contentSize = size * (1 - paddingRatio * 2);
  const offset = size * paddingRatio;

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" rx="${paddingRatio > 0 ? 0 : 96}" fill="${bgColor}" />
    <g transform="translate(${offset}, ${offset}) scale(${contentSize / 100})">
      <!-- Prism Facet Icon -->
      <!-- Top Left -->
      <path d="M 50 10 L 22 42 L 50 42 Z" fill="#38bdf8" />
      <path d="M 27 34 L 50 20 L 50 24 L 32 38 Z" fill="#ffffff" opacity="0.9" />
      <path d="M 36 42 L 50 29 L 50 33 L 42 42 Z" fill="#ffffff" opacity="0.9" />

      <!-- Top Right -->
      <path d="M 50 10 L 78 42 L 50 42 Z" fill="#818cf8" />
      <path d="M 73 34 L 50 20 L 50 24 L 68 38 Z" fill="#ffffff" opacity="0.9" />
      <path d="M 64 42 L 50 29 L 50 33 L 58 42 Z" fill="#ffffff" opacity="0.9" />

      <!-- Dividers -->
      <rect x="49" y="8" width="2" height="84" fill="#0f172a" />
      <rect x="18" y="47" width="64" height="6" fill="#0f172a" />

      <!-- Bottom Left -->
      <path d="M 50 90 L 22 58 L 50 58 Z" fill="#f43f5e" />
      <path d="M 27 66 L 50 80 L 50 76 L 32 62 Z" fill="#ffffff" opacity="0.9" />
      <path d="M 36 58 L 50 71 L 50 67 L 42 58 Z" fill="#ffffff" opacity="0.9" />

      <!-- Bottom Right -->
      <path d="M 50 90 L 78 58 L 50 58 Z" fill="#fbbf24" />
      <path d="M 73 66 L 50 80 L 50 76 L 68 62 Z" fill="#ffffff" opacity="0.9" />
      <path d="M 64 58 L 50 71 L 50 67 L 58 58 Z" fill="#ffffff" opacity="0.9" />

      <!-- Center diamond highlight -->
      <polygon points="50,44 54,50 50,56 46,50" fill="#ffffff" />
    </g>
  </svg>`;
};

async function generate() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Standalone SVG
  const standardSvg = createSvg({ paddingRatio: 0.1, bgColor: '#0f172a' });
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), standardSvg);

  // 2. 192x192 PNG
  await sharp(Buffer.from(standardSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  // 3. 512x512 PNG
  await sharp(Buffer.from(standardSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  // 4. Maskable 512x512 PNG (15% safe zone padding, full bleed solid background)
  const maskableSvg = createSvg({ paddingRatio: 0.2, bgColor: '#0f172a' });
  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  // 5. Apple Touch Icon 180x180 PNG
  await sharp(Buffer.from(standardSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // 6. Favicon 64x64 PNG & 32x32
  await sharp(Buffer.from(standardSvg))
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));

  console.log('Successfully generated all PWA icons!');
}

generate().catch(console.error);
