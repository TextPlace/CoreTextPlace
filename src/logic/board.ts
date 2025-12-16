import type { SectionData, SectionPosition } from "../types/section";
import type { BoardConfig, BoardData, CharacterPosition } from "../types/board";
import { applyChange, createSection } from "./section";
import type { BoardChange } from "../types/change";

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
  if (!board.sections[sy]) {
    if (options.readOnly) return createSection({ sx, sy }, board.config);
    board.sections[sy] = [];
  }

  const row = board.sections[sy];
  const existing = row[sx];
  if (existing) return existing;

  const section = createSection({ sx, sy }, board.config);
  if (!options.readOnly) row[sx] = section;
  return section;
}

export function applyChangeOnBoard(change: BoardChange, board: BoardData) {
  const sPos = locateSection(change, board.config);
  const section = getSectionOnBoard(sPos, board);
  applyChange(change, section);
}
