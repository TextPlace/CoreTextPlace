import type { BoardData, BoardRegion } from "../types/board";
import type { BoardRender } from "../types/render";
import { getSectionOnBoard, locateSection } from "./board";

export function render(data: BoardData): BoardRender {
  const totalLineCount = data.config.sectionHeight * data.config.ySections;
  const lineLength = data.config.sectionWidth * data.config.xSections;

  const chLines: string[][] = Array(totalLineCount);
  const colorLines: string[][] = Array(totalLineCount);
  const bgColorLines: string[][] = Array(totalLineCount);
  const widthLines: number[][] = Array(totalLineCount);

  for (let y = 0; y < totalLineCount; y++) {
    const chLine: string[] = [];
    const colorLine: string[] = [];
    const bgColorLine: string[] = [];
    const widthLine: number[] = [];

    let charsToSkip = 0;

    for (let x = 0; x < lineLength; x++) {
      if (charsToSkip > 0) {
        charsToSkip--;
        continue;
      }

      const sPos = locateSection({ x, y }, data.config);
      const section = getSectionOnBoard(sPos, data, { readOnly: true });
      const xInSection = x % data.config.sectionWidth;
      const yInSection = y % data.config.sectionHeight;

      const cCh = section.ch[yInSection]?.[xInSection] ?? " ";
      const cCo = section.color[yInSection]?.[xInSection] ?? "";
      const cBg = section.bgColor[yInSection]?.[xInSection] ?? "";
      const cWd = section.width[yInSection]?.[xInSection] ?? 1;

      chLine.push(cCh);
      colorLine.push(cCo);
      bgColorLine.push(cBg);
      widthLine.push(cWd);
      charsToSkip += cWd - 1;
    }

    chLines[y] = chLine;
    colorLines[y] = colorLine;
    bgColorLines[y] = bgColorLine;
    widthLines[y] = widthLine;
  }

  return {
    w: lineLength,
    h: totalLineCount,
    ch: chLines.flat(),
    color: colorLines.flat(),
    bg_color: bgColorLines.flat(),
    width: widthLines.flat(),
  };
}

export function cropRender(
  render: BoardRender,
  region: BoardRegion,
): BoardRender {
  const ch: string[] = [];
  const color: string[] = [];
  const bg_color: string[] = [];
  const width: number[] = [];

  const regionEndX = region.x + region.width;
  const regionEndY = region.y + region.height;

  let srcIdx = 0;
  let displayX = 0;
  let displayY = 0;

  while (srcIdx < render.ch.length) {
    const cCh = render.ch[srcIdx];
    const cCo = render.color[srcIdx];
    const cBg = render.bg_color[srcIdx];
    const cWd = render.width[srcIdx];

    if (
      typeof cCh !== "string" ||
      typeof cCo !== "string" ||
      typeof cBg !== "string" ||
      typeof cWd !== "number"
    ) {
      throw new Error("Invalid render data");
    }

    const charEndX = displayX + cWd;

    if (displayY >= region.y && displayY < regionEndY) {
      // Check if this character overlaps with the crop region horizontally
      if (charEndX > region.x && displayX < regionEndX) {
        // Clamp the width to fit within the crop region
        const clampedStartX = Math.max(displayX, region.x);
        const clampedEndX = Math.min(charEndX, regionEndX);
        const clampedWidth = clampedEndX - clampedStartX;

        ch.push(cCh);
        color.push(cCo);
        bg_color.push(cBg);
        width.push(clampedWidth);
      }
    }

    // Advance display position
    displayX += cWd;
    if (displayX >= render.w) {
      displayX = 0;
      displayY++;
    }

    srcIdx++;
  }

  return {
    w: region.width,
    h: region.height,
    ch,
    color,
    bg_color,
    width,
  };
}
