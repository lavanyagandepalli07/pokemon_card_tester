import { ReferenceCard, IMatchResult, IOCRResult } from '../models';

/**
 * Levenshtein distance between two strings (case-insensitive)
 */
function levenshtein(a: string, b: string): number {
  a = a.toLowerCase();
  b = b.toLowerCase();
  const dp: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

function similarity(a: string, b: string): number {
  if (!a && !b) return 1;
  if (!a || !b) return 0;
  const dist = levenshtein(a, b);
  return 1 - dist / Math.max(a.length, b.length);
}

/**
 * Match OCR result against reference card database.
 * 1) Try exact match on (set, number)
 * 2) Fuzzy match by name similarity across all cards
 */
export async function matchCard(ocr: IOCRResult): Promise<IMatchResult> {
  const allCards = await ReferenceCard.find({}).lean();

  if (allCards.length === 0) {
    return {
      referenceCardId: '',
      confidence: 0,
      alternatives: [],
    };
  }

  // Score each card
  const scored = allCards.map(card => {
    let score = 0;

    // Exact set+number match → very high weight
    const setMatch = ocr.set && card.set.toLowerCase() === ocr.set.toLowerCase();
    const numMatch = ocr.cardNumber && card.number.replace(/\s/g, '') === ocr.cardNumber.replace(/\s/g, '');

    if (setMatch && numMatch) {
      score = 0.99;
    } else {
      // Weighted fuzzy scoring
      const nameSim = similarity(ocr.cardName, card.name);
      const setSim   = similarity(ocr.set, card.set);
      const numSim   = numMatch ? 1 : similarity(ocr.cardNumber, card.number);
      score = nameSim * 0.5 + setSim * 0.3 + numSim * 0.2;
    }

    return { card, score };
  });

  // Sort descending
  scored.sort((a, b) => b.score - a.score);

  const top = scored[0];
  const alternatives = scored.slice(1, 6).map(s => ({
    referenceCardId: String(s.card._id),
    name: s.card.name,
    confidence: Math.round(s.score * 100) / 100,
  }));

  return {
    referenceCardId: String(top.card._id),
    referenceCard: top.card as Record<string, unknown>,
    confidence: Math.round(top.score * 100) / 100,
    alternatives,
  };
}
