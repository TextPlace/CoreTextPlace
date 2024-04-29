import type { SectionData, SectionPosition } from "../types/section.ts";
import type {
  BoardConfig,
  BoardData,
  CharacterPosition,
  FullBoard,
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
  config: BoardConfig,
): SectionPosition {
  return {
    sx: Math.floor(x / config.sectionWidth),
    sy: Math.floor(y / config.sectionHeight),
  };
}

export function renderFullBoard(data: BoardData): FullBoard {
  const totalLineCount = data.config.sectionHeight * data.config.ySections;
  const lineLength = data.config.sectionWidth * data.config.xSections;

  const chLines: string[] = Array(totalLineCount);
  const colorLines: string[] = Array(totalLineCount);
  const bgColorLines: string[] = Array(totalLineCount);
  const widthLines: string[] = Array(totalLineCount);

  for (let y = 0; y < totalLineCount; y++) {
    let chLine = "";
    let colorLine = "";
    let bgColorLine = "";
    let widthLine = "";

    let charsToSkip = 0;

    for (let x = 0; x < lineLength; x++) {
      if (charsToSkip > 0) {
        charsToSkip--;
        continue;
      }

      const { sx, sy } = locateSection({ x, y }, data.config);
      const section = data.sections[sy][sx];
      const xInSection = x % data.config.sectionWidth;
      const yInSection = y % data.config.sectionHeight;

      const cCh = section.ch[yInSection][xInSection];
      const cCo = section.color[yInSection][xInSection];
      const cBg = section.bgColor[yInSection][xInSection];
      const cWd = section.width[yInSection][xInSection];

      chLine += cCh;
      colorLine += cCo;
      bgColorLine += cBg;
      widthLine += cWd.toString();
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
    ch: chLines.join("\n"),
    color: colorLines.join("\n"),
    bg_color: bgColorLines.join("\n"),
    width: widthLines.join("\n"),
  };
}
