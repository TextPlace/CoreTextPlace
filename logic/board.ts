import type { SectionData, SectionPosition } from "../types/section.ts";
import type {
  BoardConfig,
  BoardData,
  CharacterPosition,
} from "../types/board.ts";
import { createSection } from "./section.ts";

export function createBoard(config: BoardConfig): BoardData {
  const sections: SectionData[][] = Array(config.ySections).map((_, sy) =>
    Array(config.xSections).map((_, sx) => createSection({ sx, sy }, config))
  );

  return { config, sections };
}

export function locateSection(
  { x, y }: CharacterPosition,
  config: BoardConfig
): SectionPosition {
  return {
    sx: Math.floor(x / config.sectionWidth),
    sy: Math.floor(y / config.sectionHeight),
  };
}
