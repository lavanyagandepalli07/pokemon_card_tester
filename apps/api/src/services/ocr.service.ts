import Tesseract from 'tesseract.js';
import path from 'path';
import { OCRResult } from '@pokemon-card-auth/shared-types';

/**
 * Run Tesseract OCR on an uploaded image file.
 * Returns structured card fields extracted from raw text.
 */
export async function runOCR(filename: string): Promise<OCRResult> {
  const uploadDir = process.env.UPLOAD_DIR || './public/uploads';
  const filePath = path.resolve(process.cwd(), uploadDir, filename);

  console.log(`🔍 Running OCR on: ${filePath}`);

  const { data } = await Tesseract.recognize(filePath, 'eng', {
    logger: () => {}, // silence progress logs
  });

  const rawText = data.text || '';
  console.log('📄 Raw OCR text:\n', rawText.substring(0, 300));

  return parseCardText(rawText);
}

/**
 * Parse raw OCR text into structured card fields.
 */
function parseCardText(rawText: string): OCRResult {
  const lines = rawText
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  const fullText = rawText.toLowerCase();

  // ── Extract card number (e.g. "4/102", "58/102") ──────────────────────────
  const numberMatch = rawText.match(/\b(\d{1,3})\s*\/\s*(\d{2,3})\b/);
  const cardNumber = numberMatch ? `${numberMatch[1]}/${numberMatch[2]}` : '';

  // ── Extract HP ───────────────────────────────────────────────────────────
  const hpMatch = rawText.match(/HP\s*(\d+)/i) || rawText.match(/(\d+)\s*HP/i);
  const hp = hpMatch ? parseInt(hpMatch[1], 10) : undefined;

  // ── Detect Pokémon type from known keywords ──────────────────────────────
  const TYPES = ['Fire', 'Water', 'Grass', 'Lightning', 'Psychic', 'Fighting',
                 'Colorless', 'Darkness', 'Metal', 'Dragon', 'Fairy'];
  let type: string | undefined;
  for (const t of TYPES) {
    if (fullText.includes(t.toLowerCase())) { type = t; break; }
  }

  // ── Detect known set names ────────────────────────────────────────────────
  const SETS = [
    'Base Set', 'Jungle', 'Fossil', 'Team Rocket',
    'Neo Genesis', 'Neo Discovery', 'Neo Revelation', 'Neo Destiny',
    'Gym Heroes', 'Gym Challenge',
  ];
  let set = '';
  for (const s of SETS) {
    if (fullText.includes(s.toLowerCase())) { set = s; break; }
  }

  // ── Card name = first non-trivial line that looks like a proper noun ──────
  const SKIP_WORDS = new Set(['hp', 'pokemon', 'pokémon', 'basic', 'stage', 'trainer', 'energy', 'item']);
  let cardName = '';
  for (const line of lines) {
    const words = line.split(/\s+/);
    if (
      words.length >= 1 &&
      words.length <= 4 &&
      /^[A-Z]/.test(line) &&
      !SKIP_WORDS.has(words[0].toLowerCase()) &&
      !/^\d/.test(line)
    ) {
      cardName = line;
      break;
    }
  }

  // Confidence: higher when we found all three key fields
  const fieldsFound = [cardName, set, cardNumber].filter(Boolean).length;
  const confidence = fieldsFound === 3 ? 0.9 : fieldsFound === 2 ? 0.6 : 0.3;

  return { cardName, set, cardNumber, hp, type, confidence, rawText };
}
