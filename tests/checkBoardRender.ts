import { getCharacterWidth } from "../src/logic/character";
import type { BoardRender } from "../src/types/render";

function isValidColor(color: string): boolean {
  return /^[0-9A-F]$/.test(color);
}

interface Options {
  /**
   * Whether to allow the width of a character to be narrower than the "correct" width.
   *
   * For partial renders, some wide characters may be clipped to a narrower width. This option allows for that.
   */
  allowsNarrowerWidth?: boolean;
}

export function checkBoardRender(render: BoardRender, options?: Options) {
  let chLine = "";
  let colorLine = "";
  let bgColorLine = "";
  let widthLine = "";
  let lines = 0;
  const ch = [...render.ch];
  const chLength = ch.length;

  let unsafeCurrentOffset = 0;

  function isCorrectWidth(cWd: number, cCh: string): boolean {
    const correctWidth = getCharacterWidth(cCh);
    return options?.allowsNarrowerWidth
      ? cWd <= correctWidth && cWd > 0
      : cWd === correctWidth;
  }

  for (let i = 0; i < chLength; i++) {
    const cCh = ch[i];
    const cCo = render.color[i];
    const cBg = render.bg_color[i];
    const cWd = render.width[i];

    const printSituation = () => {
      console.error(
        "offset:",
        i,
        "offset (unsafe):",
        unsafeCurrentOffset,
        "cCh:",
        JSON.stringify(cCh),
        "cCo:",
        JSON.stringify(cCo),
        "cBg:",
        JSON.stringify(cBg),
        "cWd:",
        JSON.stringify(cWd),
      );
      console.error("ch:      ", chLine);
      console.error("color:   ", colorLine);
      console.error("bg_color:", bgColorLine);
      console.error("width:   ", widthLine);
    };

    if (typeof cCh !== "string") {
      printSituation();
      throw new Error("cCh is not string");
    }

    if (!isValidColor(cCo) || !isValidColor(cBg)) {
      printSituation();
      throw new Error("cCo or cBg is not valid");
    }

    if (!isCorrectWidth(cWd, cCh)) {
      printSituation();
      throw new Error("cWd is wrong");
    }

    chLine += cCh;
    colorLine += cCo.padEnd(cWd);
    bgColorLine += cBg.padEnd(cWd);
    widthLine += String(cWd).padEnd(cWd);
    unsafeCurrentOffset += cCh.length;

    if (colorLine.length === render.w) {
      lines++;
      chLine = "";
      colorLine = "";
      bgColorLine = "";
      widthLine = "";
    }
  }

  if (lines !== render.h) throw new Error("board height error");
}
