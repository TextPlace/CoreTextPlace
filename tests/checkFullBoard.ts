import { getCharacterWidth } from "../src/logic/character.ts";
import type { FullBoard } from "../src/types/board.ts";

function isCorrectWidth(cWd: number, cCh: string): boolean {
  return getCharacterWidth(cCh) === cWd;
}

function isValidColor(color: string): boolean {
  return /^[0-9A-F]$/.test(color);
}

export function checkFullBoard(board: FullBoard) {
  let chLine = "";
  let colorLine = "";
  let bgColorLine = "";
  let widthLine = "";
  let lines = 0;
  const ch = [...board.ch];
  const chLength = ch.length;

  let unsafeCurrentOffset = 0;

  for (let i = 0; i < chLength; i++) {
    const cCh = ch[i];
    const cCo = board.color[i];
    const cBg = board.bg_color[i];
    const cWd = board.width[i];

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

    if (colorLine.length === board.w) {
      lines++;
      chLine = "";
      colorLine = "";
      bgColorLine = "";
      widthLine = "";
    }
  }

  if (lines !== board.h) throw new Error("board height error");
}
