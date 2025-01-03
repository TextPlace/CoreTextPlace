import { getCharacterWidth } from "../mod.ts";
import type { BoardConfig } from "../types/board.ts";
import type { BoardChange } from "../types/change.ts";
import type { SectionData, SectionPosition } from "../types/section.ts";

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

  const ch: string[][] = Array(boardConfig.sectionHeight).fill([]).map(() =>
    Array(boardConfig.sectionWidth).fill(boardConfig.defaultCh)
  );
  const color: string[][] = Array(boardConfig.sectionHeight).fill([]).map(() =>
    Array(boardConfig.sectionWidth).fill(boardConfig.defaultColor)
  );
  const bgColor: string[][] = Array(boardConfig.sectionHeight).fill([]).map(
    () => Array(boardConfig.sectionWidth).fill(boardConfig.defaultBgColor),
  );
  const width: number[][] = Array(boardConfig.sectionHeight).fill([]).map(() =>
    Array(boardConfig.sectionWidth).fill(boardConfig.defaultWidth)
  );

  return { offsetX, offsetY, ch, color, bgColor, width };
}

export function applyChange(change: BoardChange, section: SectionData) {
  const xInSection = change.x - section.offsetX;
  const yInSection = change.y - section.offsetY;

  const validX = xInSection >= 0 && xInSection < section.ch[0].length;
  const validY = yInSection >= 0 && yInSection < section.ch.length;
  if (!validX || !validY) {
    throw new Error("Change does not belong to this section");
  }

  if (change.ch) {
    const chWidth = getCharacterWidth(change.ch);
    const xCharacterOffset = xInSection % chWidth;
    const offsetAdjustedXInSection = xInSection - xCharacterOffset;
    section.ch[yInSection][offsetAdjustedXInSection] = change.ch;
    section.width[yInSection][offsetAdjustedXInSection] = chWidth;
  }
  if (change.color) {
    section.color[yInSection][xInSection] = change.color;
  }
  if (change.bg_color) {
    section.bgColor[yInSection][xInSection] = change.bg_color;
  }
}
