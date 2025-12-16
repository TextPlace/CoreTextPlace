import { describe, it, expect } from "vitest";

import { createBoard, getSectionOnBoard } from "../src/logic/board";
import type { BoardData } from "../src/types/board";
import { locateSection } from "../src/logic/board";
import { applyChangeOnBoard } from "../src/logic/board";

describe("board", () => {
  let board: BoardData | undefined;

  it("createBoard", () => {
    board = createBoard({
      xSections: 3,
      ySections: 3,
      sectionWidth: 4,
      sectionHeight: 3,
      defaultCh: " ",
      defaultColor: "F",
      defaultBgColor: "0",
      defaultWidth: 1,
    });

    // Sections are created on demand.
    expect(board.sections.length).toBe(0);
  });

  it("locateSection", () => {
    expect(board).toBeDefined();

    const { sx, sy } = locateSection({ x: 0, y: 0 }, board!.config);
    expect(sx).toBe(0);
    expect(sy).toBe(0);

    const { sx: sx2, sy: sy2 } = locateSection({ x: 4, y: 0 }, board!.config);
    expect(sx2).toBe(1);
    expect(sy2).toBe(0);
  });

  it("applyChangeOnBoard", () => {
    expect(board).toBeDefined();

    applyChangeOnBoard({ x: 0, y: 0, ch: "A" }, board!);
    applyChangeOnBoard({ x: 4, y: 0, ch: "B" }, board!);
    applyChangeOnBoard({ x: 0, y: 3, ch: "C" }, board!);
    applyChangeOnBoard({ x: 4, y: 3, ch: "D" }, board!);
    applyChangeOnBoard({ x: 5, y: 3, ch: "E" }, board!);

    expect(board!.sections[0]![0]!.ch[0]![0]).toBe("A");
    expect(board!.sections[0]![1]!.ch[0]![0]).toBe("B");
    expect(board!.sections[1]![0]!.ch[0]![0]).toBe("C");
    expect(board!.sections[1]![1]!.ch[0]).toEqual(["D", "E", " ", " "]);

    applyChangeOnBoard({ x: 0, y: 1, ch: "你" }, board!);
    applyChangeOnBoard({ x: 4, y: 2, ch: "好" }, board!);
    applyChangeOnBoard({ x: 0, y: 4, ch: "嗎" }, board!);
    applyChangeOnBoard({ x: 4, y: 4, ch: "嘛" }, board!);

    expect(board!.sections[0]![0]!.ch[1]![0]).toBe("你");
    expect(board!.sections[0]![1]!.ch[2]![0]).toBe("好");
    expect(board!.sections[1]![0]!.ch[1]![0]).toBe("嗎");
    expect(board!.sections[1]![1]!.ch[1]).toEqual(["嘛", " ", " ", " "]);

    applyChangeOnBoard({ x: 5, y: 4, ch: "啊" }, board!);
    expect(board!.sections[1]![1]!.ch[1]).toEqual(["啊", " ", " ", " "]);
  });

  it("getSectionOnBoard: existing section", () => {
    expect(board).toBeDefined();

    const section = getSectionOnBoard({ sx: 1, sy: 1 }, board!, {
      readOnly: true,
    });
    expect(section.ch[0]).toEqual(["D", "E", " ", " "]);
    expect(section.color[0]![0]).toBe("F");
    expect(section.bgColor[0]![0]).toBe("0");
    expect(section.width[0]).toEqual([1, 1, 1, 1]);
  });

  it("getSectionOnBoard: non-existing row", () => {
    expect(board).toBeDefined();

    const section = getSectionOnBoard({ sx: 1, sy: 2 }, board!, {
      readOnly: true,
    });
    expect(section.ch[0]![0]).toBe(" ");
    expect(section.color[0]![0]).toBe("F");
    expect(section.bgColor[0]![0]).toBe("0");
    expect(section.width[0]![0]).toBe(1);
  });

  it("getSectionOnBoard: non-existing section", () => {
    expect(board).toBeDefined();

    const section = getSectionOnBoard({ sx: 2, sy: 1 }, board!, {
      readOnly: true,
    });
    expect(section.ch[0]![0]).toBe(" ");
    expect(section.color[0]![0]).toBe("F");
    expect(section.bgColor[0]![0]).toBe("0");
    expect(section.width[0]![0]).toBe(1);
  });

  it("on-demand creation: only changed sections are saved", () => {
    expect(board).toBeDefined();

    expect(board!.sections[2]).toBeUndefined();
    expect(board!.sections[0]![2]).toBeUndefined();
  });
});
