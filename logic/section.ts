import { getCharacterWidth } from "../mod.ts";
import type { BoardConfig } from "../types/board.ts";
import { BoardChange } from "../types/change.ts";
import type { SectionData, SectionPosition } from "../types/section.ts";

export function createSection(
  { sx, sy }: SectionPosition,
  boardConfig: BoardConfig
): SectionData {
  const offsetX = sx * boardConfig.sectionWidth;
  const offsetY = sy * boardConfig.sectionHeight;

  const ch: string[][] = Array(boardConfig.sectionHeight).fill(
    Array(boardConfig.sectionWidth).fill(boardConfig.defaultCh)
  );
  const color: string[][] = Array(boardConfig.sectionHeight).fill(
    Array(boardConfig.sectionWidth).fill(boardConfig.defaultColor)
  );
  const bgColor: string[][] = Array(boardConfig.sectionHeight).fill(
    Array(boardConfig.sectionWidth).fill(boardConfig.defaultBgColor)
  );
  const width: number[][] = Array(boardConfig.sectionHeight).fill(
    Array(boardConfig.sectionWidth).fill(boardConfig.defaultWidth)
  );

  return { offsetX, offsetY, ch, color, bgColor, width };
}

export function applyChange(change: BoardChange, section: SectionData) {
  const xInSection = change.x - section.offsetX;
  const yInSection = change.y - section.offsetY;

  if (change.ch) {
    const chWidth = getCharacterWidth(change.ch);
    section.ch[yInSection][xInSection] = change.ch;
    section.width[yInSection][xInSection] = chWidth;
  }
  if (change.color) {
    section.color[yInSection][xInSection] = change.color;
  }
  if (change.bg_color) {
    section.bgColor[yInSection][xInSection] = change.bg_color;
  }
}
