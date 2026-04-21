const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  jugadores: { width: 900,  quality: 78 },
  ambiente:  { width: 800,  quality: 75 },
  marcas:    { width: 1000, quality: 78 },
};

const INPUT_DIR  = path.join(__dirname, 'fotos');
const OUTPUT_DIR = path.join(__dirname, 'fotos-opt');

async function processFile(inputPath, outputPath, config) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  await sharp(inputPath)
    .resize({ width: config.width, withoutEnlargement: true })
    .webp({ quality: config.quality })
    .toFile(outputPath);
  const inSize  = fs.statSync(inputPath).size;
  const outSize = fs.statSync(outputPath).size;
  const saving  = Math.round((1 - outSize / inSize) * 100);
  console.log(`${path.basename(outputPath)} — ${(inSize/1e6).toFixed(1)}MB → ${(outSize/1e3).toFixed(0)}KB (${saving}% menos)`);
}

async function run() {
  const exts = ['.jpg', '.jpeg', '.png'];
  let total = 0;

  for (const folder of Object.keys(CONFIG)) {
    const inputFolder  = path.join(INPUT_DIR, folder);
    const outputFolder = path.join(OUTPUT_DIR, folder);
    if (!fs.existsSync(inputFolder)) continue;

    const files = fs.readdirSync(inputFolder).filter(f => exts.includes(path.extname(f).toLowerCase()));
    for (const file of files) {
      const inputPath  = path.join(inputFolder, file);
      const outputPath = path.join(outputFolder, path.basename(file, path.extname(file)) + '.webp');
      await processFile(inputPath, outputPath, CONFIG[folder]);
      total++;
    }
  }
  console.log(`\nListo. ${total} fotos optimizadas en fotos-opt/`);
}

run().catch(console.error);
