import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths
const SVG_SOURCE = join(__dirname, '../client/public/growfastwithus-fav.svg');
const OUTPUT_DIR = join(__dirname, '../client/public');

// Sizes to generate
const PNG_SIZES = [16, 32, 48, 96, 180, 192, 512];
const ICO_SIZES = [16, 32, 48];

console.log('🎨 Starting favicon generation...\n');

// Read SVG source
const svgBuffer = readFileSync(SVG_SOURCE);

// Generate PNG files
async function generatePNGs() {
  console.log('📦 Generating PNG files...');
  
  for (const size of PNG_SIZES) {
    const outputPath = join(OUTPUT_DIR, `favicon-${size}x${size}.png`);
    
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    
    console.log(`  ✅ Generated: favicon-${size}x${size}.png`);
  }
}

// Generate multi-size ICO file
async function generateICO() {
  console.log('\n📦 Generating favicon.ico...');
  
  const icoPath = join(OUTPUT_DIR, 'favicon.ico');
  
  // Generate PNG buffer for ICO creation
  const pngBuffer = await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toBuffer();
  
  // Create simple ICO file from PNG buffer
  const icoBuffer = createSimpleICO(pngBuffer, 32);
  writeFileSync(icoPath, icoBuffer);
  
  console.log('  ✅ Generated: favicon.ico');
}

// Create a simple ICO file from PNG buffer
function createSimpleICO(pngBuffer, size) {
  // ICO format:
  // Header (6 bytes) + Directory Entry (16 bytes) + PNG data
  
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved (must be 0)
  header.writeUInt16LE(1, 2); // Image type (1 = ICO)
  header.writeUInt16LE(1, 4); // Number of images
  
  const dirEntry = Buffer.alloc(16);
  dirEntry.writeUInt8(size === 256 ? 0 : size, 0); // Width (0 means 256)
  dirEntry.writeUInt8(size === 256 ? 0 : size, 1); // Height (0 means 256)
  dirEntry.writeUInt8(0, 2); // Color palette (0 = no palette)
  dirEntry.writeUInt8(0, 3); // Reserved
  dirEntry.writeUInt16LE(1, 4); // Color planes
  dirEntry.writeUInt16LE(32, 6); // Bits per pixel
  dirEntry.writeUInt32LE(pngBuffer.length, 8); // Size of image data
  dirEntry.writeUInt32LE(22, 12); // Offset to image data (6 + 16)
  
  return Buffer.concat([header, dirEntry, pngBuffer]);
}

// Generate Apple Touch Icon
async function generateAppleTouchIcon() {
  console.log('\n📦 Generating Apple Touch Icon...');
  
  const outputPath = join(OUTPUT_DIR, 'apple-touch-icon.png');
  
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(outputPath);
  
  console.log('  ✅ Generated: apple-touch-icon.png');
}

// Main execution
async function generateAll() {
  try {
    await generatePNGs();
    await generateICO();
    await generateAppleTouchIcon();
    
    console.log('\n✨ All favicons generated successfully!');
    console.log('\n📝 Next steps:');
    console.log('  1. Commit the new favicon files');
    console.log('  2. Deploy your site');
    console.log('  3. Request Google to re-crawl your site via Search Console');
    console.log('  4. Wait for Google to update (can take a few days)\n');
  } catch (error) {
    console.error('\n❌ Error generating favicons:', error);
    process.exit(1);
  }
}

generateAll();

