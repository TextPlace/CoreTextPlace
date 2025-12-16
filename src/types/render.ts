/**
 * A compact form to represent a render of a board or a part of.
 *
 * Note that this form is not designed for manipulation. It's designed for transmission and rendering, and can not be converted back to `BoardData` as all "over-shadowed" characters are removed.
 */
export interface BoardRender {
  /** The total width of the render, in display characters (`ch`). */
  w: number;
  /** The total height of the render, in `ch`. */
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
