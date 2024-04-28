const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
const cjkRegex =
  /[\p{Unified_Ideograph}\u30A0-\u30FF\u3040-\u309F\u31F0-\u31FF]/u;
const printableASCIIRegex = /^[\x20-\x7E]$/;

export function getCharacterWidth(ch: string): number {
  const segments = [...segmenter.segment(ch)];
  if (segments.length !== 1)
    throw new Error(
      `Expected exactly one grapheme cluster, got ${segments.length}.`
    );

  const matchesASCII = ch.match(printableASCIIRegex);
  const matchesCJK = ch.match(cjkRegex);

  if (!matchesASCII && !matchesCJK) throw new Error(`Invalid character: ${ch}`);

  // TODO: Support Emojis.
  return matchesCJK ? 2 : 1;
}
