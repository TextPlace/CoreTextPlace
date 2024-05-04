import { getCharacterWidth } from "../logic/character.ts";
import type { FullBoard } from "../types/board.ts";

function isCorrectWidth(cWdRaw: string, cCh: string): boolean {
  return getCharacterWidth(cCh).toString() === cWdRaw;
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
    const cWdRaw = board.width[i];
    const cWd = parseInt(cWdRaw);

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
        JSON.stringify(cWdRaw),
      );
      console.error("ch:      ", chLine);
      console.error("color:   ", colorLine);
      console.error("bg_color:", bgColorLine);
      console.error("width:   ", widthLine);
    };

    if (cCh === "\n") {
      if (cCo !== "\n" || cBg !== "\n" || cWdRaw !== "\n") {
        printSituation();
        throw new Error("cCh is newline while at least one other field aren't");
      }

      if (colorLine.length !== board.w) {
        printSituation();
        throw new Error("color line length error");
      }
      if (bgColorLine.length !== board.w) {
        printSituation();
        throw new Error("bg color line length error");
      }
      if (widthLine.length !== board.w) {
        printSituation();
        throw new Error("width line length error");
      }

      chLine = "";
      colorLine = "";
      bgColorLine = "";
      widthLine = "";
      lines++;
      unsafeCurrentOffset += cCh.length;

      continue;
    }

    if (!isValidColor(cCo) || !isValidColor(cBg)) {
      printSituation();
      throw new Error("cCo or cBg is not valid");
    }

    if (!isCorrectWidth(cWdRaw, cCh)) {
      printSituation();
      throw new Error("cWd is wrong");
    }

    chLine += cCh;
    colorLine += cCo.padEnd(cWd);
    bgColorLine += cBg.padEnd(cWd);
    widthLine += cWdRaw.padEnd(cWd);
    unsafeCurrentOffset += cCh.length;
  }

  if (lines + 1 !== board.h) throw new Error("board height error");
}
