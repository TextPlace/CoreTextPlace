import { unicodeWidth } from "@std/cli/unicode-width";

const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });

export function getCharacterWidth(ch: string): number {
  const segments = [...segmenter.segment(ch)];
  if (segments.length !== 1) {
    throw new Error(
      `Expected exactly one grapheme cluster, got ${segments.length}.`,
    );
  }

  return unicodeWidth(ch);
}
