import type { CharacterPosition } from "./board.ts";

/**
 * A change to the board.
 *
 * At least one field must be specified. The rules usually only allow one field at a time.
 */
export interface BoardChange extends CharacterPosition {
  /** New character for this position. */
  ch?: string;
  /** New foreground color for this position. */
  color?: string;
  /** New background color for this position. */
  bg_color?: string;
}
