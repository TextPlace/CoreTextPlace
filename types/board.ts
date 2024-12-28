import type { SectionData } from "./section.ts";

/**
 * A compact form to represent the whole game board.
 *
 * Note that this form is not designed for manipulation. It's designed for transmission and rendering, and can not be converted back to `BoardData` as all "over-shadowed" characters are removed.
 */
export interface FullBoard {
  /** The total width of the board, in display characters (`ch`). */
  w: number;
  /** The total height of the board, in `ch`. */
  h: number;

  /** Compact array of characters on board. */
  ch: string[];
  /** Compact array of color, for each character. */
  color: string[];
  /** Compact array of background color, for each character. */
  bg_color: string[];
  /** Compact array of width indicator for each character. */
  width: number[];
}

/**
 * A structure defining a character position on board.
 *
 * In TextPlace, origin point (`0, 0`) is at the top-leading corner of the board. The X axis goes from leading (left) edge to trailing (right) edge while the Y axis goes from top to down.
 */
export interface CharacterPosition {
  /** 0-based index on X axis. */
  x: number;
  /** 0-based index on Y axis. */
  y: number;
}

export interface BoardConfig {
  xSections: number;
  ySections: number;
  /**
   * Width of each section, in display characters.
   *
   * Note that this must be a multiple of the least common multiple of all possible character display width (returned by `getCharacterWidth`).
   */
  sectionWidth: number;
  sectionHeight: number;

  defaultCh: string;
  defaultColor: string;
  defaultBgColor: string;
  defaultWidth: number;
}

export interface BoardData {
  /**
   * Configuration of the board.
   *
   * This is a static configuration that does not change during the game.
   */
  config: BoardConfig;
  /** Sections of the whole board, arranged in `sections[y][x]` fashion. */
  sections: SectionData[][];
}
