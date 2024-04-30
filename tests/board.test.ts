import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.224.0/assert/mod.ts";

import { createBoard, renderFullBoard } from "../logic/board.ts";
import { BoardData } from "../mod.ts";
import { checkFullBoard } from "./checkFullBoard.ts";

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

  await t.step("renderFullBoard", () => {
    assert(board);

    const rendered = renderFullBoard(board);

    checkFullBoard(rendered);
  });
});
