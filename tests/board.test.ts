import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.224.0/assert/mod.ts";

import {
  createBoard,
  getSectionOnBoard,
  renderFullBoard,
} from "../logic/board.ts";
import type { BoardData } from "../types/board.ts";
import { checkFullBoard } from "./checkFullBoard.ts";
import { locateSection } from "../logic/board.ts";
import { applyChangeOnBoard } from "../logic/board.ts";

Deno.test("board", async (t) => {
  let board: BoardData | undefined;

  await t.step("createBoard", () => {
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
    assertEquals(board.sections.length, 0);
  });

  await t.step("locateSection", () => {
    assert(board);

    const { sx, sy } = locateSection({ x: 0, y: 0 }, board.config);
    assertEquals(sx, 0);
    assertEquals(sy, 0);

    const { sx: sx2, sy: sy2 } = locateSection({ x: 4, y: 0 }, board.config);
    assertEquals(sx2, 1);
    assertEquals(sy2, 0);
  });

  await t.step("applyChangeOnBoard", () => {
    assert(board);

    applyChangeOnBoard({ x: 0, y: 0, ch: "A" }, board);
    applyChangeOnBoard({ x: 4, y: 0, ch: "B" }, board);
    applyChangeOnBoard({ x: 0, y: 3, ch: "C" }, board);
    applyChangeOnBoard({ x: 4, y: 3, ch: "D" }, board);
    applyChangeOnBoard({ x: 5, y: 3, ch: "E" }, board);

    assertEquals(board.sections[0][0].ch[0][0], "A");
    assertEquals(board.sections[0][1].ch[0][0], "B");
    assertEquals(board.sections[1][0].ch[0][0], "C");
    assertEquals(board.sections[1][1].ch[0], ["D", "E", " ", " "]);

    applyChangeOnBoard({ x: 0, y: 1, ch: "你" }, board);
    applyChangeOnBoard({ x: 4, y: 2, ch: "好" }, board);
    applyChangeOnBoard({ x: 0, y: 4, ch: "嗎" }, board);
    applyChangeOnBoard({ x: 4, y: 4, ch: "嘛" }, board);

    assertEquals(board.sections[0][0].ch[1][0], "你");
    assertEquals(board.sections[0][1].ch[2][0], "好");
    assertEquals(board.sections[1][0].ch[1][0], "嗎");
    assertEquals(board.sections[1][1].ch[1], ["嘛", " ", " ", " "]);

    applyChangeOnBoard({ x: 5, y: 4, ch: "啊" }, board);
    assertEquals(board.sections[1][1].ch[1], ["啊", " ", " ", " "]);
  });

  await t.step("getSectionOnBoard: existing section", () => {
    assert(board);

    const section = getSectionOnBoard({ sx: 1, sy: 1 }, board, {
      readOnly: true,
    });
    assertEquals(section.ch[0], ["D", "E", " ", " "]);
    assertEquals(section.color[0][0], "F");
    assertEquals(section.bgColor[0][0], "0");
    assertEquals(section.width[0], [1, 1, 1, 1]);
  });

  await t.step("getSectionOnBoard: non-existing row", () => {
    assert(board);

    const section = getSectionOnBoard({ sx: 1, sy: 2 }, board, {
      readOnly: true,
    });
    assertEquals(section.ch[0][0], " ");
    assertEquals(section.color[0][0], "F");
    assertEquals(section.bgColor[0][0], "0");
    assertEquals(section.width[0][0], 1);
  });

  await t.step("getSectionOnBoard: non-existing section", () => {
    assert(board);

    const section = getSectionOnBoard({ sx: 2, sy: 1 }, board, {
      readOnly: true,
    });
    assertEquals(section.ch[0][0], " ");
    assertEquals(section.color[0][0], "F");
    assertEquals(section.bgColor[0][0], "0");
    assertEquals(section.width[0][0], 1);
  });

  await t.step("renderFullBoard", () => {
    assert(board);

    const rendered = renderFullBoard(board);
    checkFullBoard(rendered);
  });

  await t.step("on-demand creation: only changed sections are saved", () => {
    assert(board);

    assertEquals(board.sections[2], undefined);
    assertEquals(board.sections[0][2], undefined);
  });
});
