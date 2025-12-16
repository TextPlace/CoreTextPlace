import { getCharacterWidth } from "../mod";
import type { BoardConfig } from "../types/board";
import type { BoardChange } from "../types/change";
import type { SectionData, SectionPosition } from "../types/section";

export function createSection(
  { sx, sy }: SectionPosition,
  boardConfig: BoardConfig,
): SectionData {
  if (boardConfig.sectionWidth % 2 !== 0) {
    throw new Error(
      "sectionWidth must be multiple of 2 (least common multiples of all character widths)",
    );
  }

  const offsetX = sx * boardConfig.sectionWidth;
  const offsetY = sy * boardConfig.sectionHeight;

  const ch: string[][] = Array(boardConfig.sectionHeight)
    .fill([])
    .map(() => Array(boardConfig.sectionWidth).fill(boardConfig.defaultCh));
  const color: string[][] = Array(boardConfig.sectionHeight)
    .fill([])
    .map(() => Array(boardConfig.sectionWidth).fill(boardConfig.defaultColor));
  const bgColor: string[][] = Array(boardConfig.sectionHeight)
    .fill([])
    .map(() =>
      Array(boardConfig.sectionWidth).fill(boardConfig.defaultBgColor),
    );
  const width: number[][] = Array(boardConfig.sectionHeight)
    .fill([])
    .map(() => Array(boardConfig.sectionWidth).fill(boardConfig.defaultWidth));

  return { offsetX, offsetY, ch, color, bgColor, width };
}

export function applyChange(change: BoardChange, section: SectionData) {
  const xInSection = change.x - section.offsetX;
  const yInSection = change.y - section.offsetY;

  const row0 = section.ch[0];
  const validX =
    xInSection >= 0 && row0 !== undefined && xInSection < row0.length;
  const validY = yInSection >= 0 && yInSection < section.ch.length;

  const chRow = section.ch[yInSection];
  const widthRow = section.width[yInSection];
  const colorRow = section.color[yInSection];
  const bgColorRow = section.bgColor[yInSection];

  const hasRowsForY =
    chRow !== undefined &&
    widthRow !== undefined &&
    colorRow !== undefined &&
    bgColorRow !== undefined;

  if (!validX || !validY || !hasRowsForY) {
    throw new Error("Change does not belong to this section");
  }

  if (change.ch) {
    const chWidth = getCharacterWidth(change.ch);
    const xCharacterOffset = xInSection % chWidth;
    const offsetAdjustedXInSection = xInSection - xCharacterOffset;
    chRow[offsetAdjustedXInSection] = change.ch;
    widthRow[offsetAdjustedXInSection] = chWidth;
  }
  if (change.color) {
    colorRow[xInSection] = change.color;
  }
  if (change.bg_color) {
    bgColorRow[xInSection] = change.bg_color;
  }
}
