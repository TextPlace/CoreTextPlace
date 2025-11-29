/**
 * A section of the whole board.
 *
 * This form is how board data actually stored in the backend. It's a more structured form than `FullBoard` designed for the ease and efficiency of manipulation.
 *
 * This structure should not be exposed to clients and renderers.
 */
export interface SectionData {
  /** X axis position of this section's origin point (`(0, 0)`), in board's frame of reference. */
  offsetX: number;
  /** Y axis position of this section's origin point (`(0, 0)`), in board's frame of reference. */
  offsetY: number;
  /**
   * Every character in this section.
   *
   * The first index is the Y axis, and the second index is the X axis, which means `ch[y][x]` points to the character at `(x, y)` in this section.
   *
   * Please pay special attention to that though we use the term *character*, each `ch[y][x]` is actually an [**extended grapheme cluster**](https://unicode.org/reports/tr29/#Grapheme_Cluster_Boundaries) (*user-perceived chracter*), not a single byte or character.
   */
  ch: string[][];
  /** Foreground color of each character in this section. */
  color: string[][];
  /** Background color of each character in this section. */
  bgColor: string[][];
  /**
   * Width indicator of each character in this section.
   *
   * For every character, the width indicator is the number of display characters it occupies. For example, a full-width character occupies 2 display characters, while a half-width character occupies 1 display character.
   *
   * Every one of these numbers must be a integer between `1` and `9` (including both ends), as in compact string form it's encoded as a single digit in decimal.
   */
  width: number[][];
}

export interface SectionPosition {
  sx: number;
  sy: number;
}
