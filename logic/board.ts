import type { SectionData, SectionPosition } from "../types/section.ts";
import type {
  BoardConfig,
  BoardData,
  CharacterPosition,
  FullBoard,
} from "../types/board.ts";
import { applyChange, createSection } from "./section.ts";
import type { BoardChange } from "../types/change.ts";

export function createBoard(config: BoardConfig): BoardData {
  return { config, sections: [] };
}

export function locateSection(
  { x, y }: CharacterPosition,
  config: BoardConfig,
): SectionPosition {
  return {
    sx: Math.floor(x / config.sectionWidth),
    sy: Math.floor(y / config.sectionHeight),
  };
}

/**
 * Get a section from board.
 *
 * If the section does not exist yet, it will be created and (optionally) added to `board`.
 */
export function getSectionOnBoard(
  { sx, sy }: SectionPosition,
  board: BoardData,
  options: {
    /**
     * Whether the section data is only used for reading.
     *
     * If `true`, this function will return an empty section configured with default values, but will not add it to the board data to save storage.
     */
    readOnly: boolean;
  } = { readOnly: false },
): SectionData {
  let section: SectionData;
  if (!board.sections[sy] && !options.readOnly) board.sections[sy] = [];

  if (!board.sections[sy]?.[sx]) {
    section = createSection({ sx, sy }, board.config);
    if (!options.readOnly) board.sections[sy][sx] = section;
  } else {
    section = board.sections[sy][sx];
  }
  return section;
}

export function applyChangeOnBoard(change: BoardChange, board: BoardData) {
  const sPos = locateSection(change, board.config);
  const section = getSectionOnBoard(sPos, board);
  applyChange(change, section);
}

export function renderFullBoard(data: BoardData): FullBoard {
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

      const cCh = section.ch[yInSection][xInSection];
      const cCo = section.color[yInSection][xInSection];
      const cBg = section.bgColor[yInSection][xInSection];
      const cWd = section.width[yInSection][xInSection];

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
