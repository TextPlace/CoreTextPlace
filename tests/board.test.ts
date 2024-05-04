import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.224.0/assert/mod.ts";

import { createBoard, renderFullBoard } from "../logic/board.ts";
import { BoardData } from "../types/board.ts";
import { checkFullBoard } from "./checkFullBoard.ts";
import { locateSection } from "../logic/board.ts";
import { applyChangeOnBoard } from "../logic/board.ts";

Deno.test("board", async (t) => {
  let board: BoardData | undefined;

  await t.step("createBoard", () => {
    board = createBoard({
      xSections: 2,
      ySections: 2,
      sectionWidth: 4,
      sectionHeight: 3,
      defaultCh: " ",
      defaultColor: "F",
      defaultBgColor: "0",
      defaultWidth: 1,
    });

    assertEquals(board.sections.length, 2);
    assertEquals(board.sections[0].length, 2);
    assertEquals(board.sections[0][0].offsetX, 0);
    assertEquals(board.sections[0][0].offsetY, 0);
    assertEquals(board.sections[0][1].offsetX, 4);
    assertEquals(board.sections[0][1].offsetY, 0);
    assertEquals(board.sections[1].length, 2);
    assertEquals(board.sections[1][0].offsetX, 0);
    assertEquals(board.sections[1][0].offsetY, 3);
    assertEquals(board.sections[1][1].offsetX, 4);
    assertEquals(board.sections[1][1].offsetY, 3);
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

    assertEquals(board.sections[0][0].ch[0][0], "A");
    assertEquals(board.sections[0][1].ch[0][0], "B");
    assertEquals(board.sections[1][0].ch[0][0], "C");
    assertEquals(board.sections[1][1].ch[0][0], "D");

    applyChangeOnBoard({ x: 0, y: 1, ch: "你" }, board);
    applyChangeOnBoard({ x: 4, y: 2, ch: "好" }, board);
    applyChangeOnBoard({ x: 0, y: 4, ch: "嗎" }, board);
    applyChangeOnBoard({ x: 4, y: 4, ch: "嘛" }, board);

    assertEquals(board.sections[0][0].ch[1][0], "你");
    assertEquals(board.sections[0][1].ch[2][0], "好");
    assertEquals(board.sections[1][0].ch[1][0], "嗎");
    assertEquals(board.sections[1][1].ch[2][0], "嘛");
  });

  await t.step("renderFullBoard", () => {
    assert(board);

    const rendered = renderFullBoard(board);
    checkFullBoard(rendered);
  });
});
