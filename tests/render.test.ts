import { describe, expect, it } from "vitest";
import { render, cropRender } from "../src/logic/render";
import { checkBoardRender } from "./checkBoardRender";
import { applyChangeOnBoard, createBoard } from "../src/logic/board";
import type { BoardData } from "../src/types/board";
import type { BoardRender } from "../src/types/render";

const board: BoardData = createBoard({
  xSections: 1,
  ySections: 1,
  sectionWidth: 10,
  sectionHeight: 5,
  defaultCh: " ",
  defaultColor: "F",
  defaultBgColor: "0",
  defaultWidth: 1,
});

// Add CJK characters (width 2)
applyChangeOnBoard({ x: 0, y: 0, ch: "你" }, board);
applyChangeOnBoard({ x: 2, y: 0, ch: "好" }, board);
applyChangeOnBoard({ x: 4, y: 0, ch: "世" }, board);
applyChangeOnBoard({ x: 6, y: 0, ch: "界" }, board);

// Add cell with non-default foreground color
applyChangeOnBoard({ x: 0, y: 1, ch: "A" }, board);
applyChangeOnBoard({ x: 0, y: 1, color: "C" }, board);

// Add cell with non-default background color
applyChangeOnBoard({ x: 2, y: 1, ch: "B" }, board);
applyChangeOnBoard({ x: 2, y: 1, bg_color: "A" }, board);

// Add cell with both non-default foreground and background colors
applyChangeOnBoard({ x: 4, y: 1, ch: "C" }, board);
applyChangeOnBoard({ x: 4, y: 1, color: "9" }, board);
applyChangeOnBoard({ x: 4, y: 1, bg_color: "E" }, board);

// Add CJK character with custom colors
applyChangeOnBoard({ x: 0, y: 2, ch: "中" }, board);
applyChangeOnBoard({ x: 0, y: 2, color: "D" }, board);
applyChangeOnBoard({ x: 0, y: 2, bg_color: "B" }, board);

describe("render", () => {
  it("render", () => {
    expect(board).toBeDefined();

    const rendered = render(board!);
    checkBoardRender(rendered);
  });
});

describe("cropRender", () => {
  // Helper to create a simple render for testing
  function createTestRender(): BoardRender {
    // Create a 10x5 board with:
    // Row 0: "你好世界  " (4 CJK chars = 8 display cols + 2 spaces)
    // Row 1: "A B C     " (ASCII with spaces)
    // Row 2: "中        " (1 CJK char + 8 spaces)
    // Row 3: "          " (all spaces)
    // Row 4: "          " (all spaces)
    return render(board);
  }

  describe("basic cropping with width-1 characters", () => {
    it("crops a region containing only width-1 characters", () => {
      const rendered = createTestRender();
      // Crop row 1 (ASCII chars), columns 0-5
      const cropped = cropRender(rendered, { x: 0, y: 1, width: 5, height: 1 });

      expect(cropped.w).toBe(5);
      expect(cropped.h).toBe(1);
      checkBoardRender(cropped);
    });

    it("crops middle section of width-1 characters", () => {
      const rendered = createTestRender();
      // Crop row 1, columns 1-4 (should get " B C")
      const cropped = cropRender(rendered, { x: 1, y: 1, width: 4, height: 1 });

      expect(cropped.w).toBe(4);
      expect(cropped.h).toBe(1);
      checkBoardRender(cropped);
    });
  });

  describe("wide characters (width 2)", () => {
    it("includes wide character entirely within crop region", () => {
      const rendered = createTestRender();
      // Crop row 0, columns 0-4 (should include "你好")
      const cropped = cropRender(rendered, { x: 0, y: 0, width: 4, height: 1 });

      expect(cropped.w).toBe(4);
      expect(cropped.h).toBe(1);
      expect(cropped.ch).toContain("你");
      expect(cropped.ch).toContain("好");
      checkBoardRender(cropped);
    });

    it("handles wide character at crop start boundary (character starts before region)", () => {
      const rendered = createTestRender();
      // Crop starting at x=1 - "你" starts at x=0 and extends to x=2
      // The crop should include "你" with clamped width of 1
      const cropped = cropRender(rendered, { x: 1, y: 0, width: 3, height: 1 });

      expect(cropped.w).toBe(3);
      expect(cropped.h).toBe(1);
      // "你" should be included but with width clamped to 1 (only 1 col visible)
      expect(cropped.ch).toContain("你");
      checkBoardRender(cropped, { allowsNarrowerWidth: true });
    });

    it("handles wide character at crop end boundary (character extends beyond region)", () => {
      const rendered = createTestRender();
      // Crop ending at x=3 - "好" starts at x=2 and extends to x=4
      // The crop should include "好" with clamped width of 1
      const cropped = cropRender(rendered, { x: 0, y: 0, width: 3, height: 1 });

      expect(cropped.w).toBe(3);
      expect(cropped.h).toBe(1);
      // "你" should be included with full width, "好" should be clamped
      expect(cropped.ch).toContain("你");
      expect(cropped.ch).toContain("好");
      checkBoardRender(cropped, { allowsNarrowerWidth: true });
    });

    it("handles wide character with both boundaries clamped", () => {
      const rendered = createTestRender();
      // Crop from x=1 to x=2 (width 1) - only partial view of "你"
      const cropped = cropRender(rendered, { x: 1, y: 0, width: 1, height: 1 });

      expect(cropped.w).toBe(1);
      expect(cropped.h).toBe(1);
      checkBoardRender(cropped, { allowsNarrowerWidth: true });
    });

    it("excludes wide character entirely outside crop region", () => {
      const rendered = createTestRender();
      // Crop row 0, columns 8-10 (should only get spaces, no CJK)
      const cropped = cropRender(rendered, { x: 8, y: 0, width: 2, height: 1 });

      expect(cropped.w).toBe(2);
      expect(cropped.h).toBe(1);
      // Should only contain spaces
      expect(cropped.ch.every((c) => c === " ")).toBe(true);
      checkBoardRender(cropped);
    });
  });

  describe("multi-row cropping", () => {
    it("crops multiple rows correctly", () => {
      const rendered = createTestRender();
      // Crop rows 0-2, columns 0-4
      const cropped = cropRender(rendered, { x: 0, y: 0, width: 4, height: 3 });

      expect(cropped.w).toBe(4);
      expect(cropped.h).toBe(3);
      checkBoardRender(cropped);
    });

    it("crops rows from middle of board", () => {
      const rendered = createTestRender();
      // Crop rows 1-3, columns 2-6
      const cropped = cropRender(rendered, { x: 2, y: 1, width: 4, height: 3 });

      expect(cropped.w).toBe(4);
      expect(cropped.h).toBe(3);
      checkBoardRender(cropped);
    });

    it("handles wide characters across multiple rows", () => {
      const rendered = createTestRender();
      // Crop rows 0 and 2 which both have CJK characters
      const cropped = cropRender(rendered, { x: 0, y: 0, width: 4, height: 3 });

      expect(cropped.w).toBe(4);
      expect(cropped.h).toBe(3);
      expect(cropped.ch).toContain("你");
      expect(cropped.ch).toContain("中");
      checkBoardRender(cropped);
    });
  });

  describe("full board crop", () => {
    it("returns equivalent data when cropping entire board", () => {
      const rendered = createTestRender();
      const cropped = cropRender(rendered, {
        x: 0,
        y: 0,
        width: rendered.w,
        height: rendered.h,
      });

      expect(cropped.w).toBe(rendered.w);
      expect(cropped.h).toBe(rendered.h);
      expect(cropped.ch).toEqual(rendered.ch);
      expect(cropped.color).toEqual(rendered.color);
      expect(cropped.bg_color).toEqual(rendered.bg_color);
      expect(cropped.width).toEqual(rendered.width);
      checkBoardRender(cropped);
    });
  });

  describe("edge cases", () => {
    it("handles zero-width region", () => {
      const rendered = createTestRender();
      const cropped = cropRender(rendered, { x: 0, y: 0, width: 0, height: 1 });

      expect(cropped.w).toBe(0);
      expect(cropped.h).toBe(1);
      expect(cropped.ch).toEqual([]);
    });

    it("handles zero-height region", () => {
      const rendered = createTestRender();
      const cropped = cropRender(rendered, { x: 0, y: 0, width: 5, height: 0 });

      expect(cropped.w).toBe(5);
      expect(cropped.h).toBe(0);
      expect(cropped.ch).toEqual([]);
    });

    it("handles single cell crop", () => {
      const rendered = createTestRender();
      const cropped = cropRender(rendered, { x: 0, y: 1, width: 1, height: 1 });

      expect(cropped.w).toBe(1);
      expect(cropped.h).toBe(1);
      expect(cropped.ch.length).toBe(1);
      expect(cropped.ch[0]).toBe("A");
      checkBoardRender(cropped);
    });

    it("handles crop at bottom-right corner", () => {
      const rendered = createTestRender();
      const cropped = cropRender(rendered, { x: 8, y: 4, width: 2, height: 1 });

      expect(cropped.w).toBe(2);
      expect(cropped.h).toBe(1);
      checkBoardRender(cropped);
    });

    it("handles crop region starting beyond first row", () => {
      const rendered = createTestRender();
      const cropped = cropRender(rendered, { x: 0, y: 3, width: 5, height: 2 });

      expect(cropped.w).toBe(5);
      expect(cropped.h).toBe(2);
      // Should only contain spaces (rows 3-4 are empty)
      expect(cropped.ch.every((c) => c === " ")).toBe(true);
      checkBoardRender(cropped);
    });
  });

  describe("color preservation", () => {
    it("preserves foreground color when cropping", () => {
      const rendered = createTestRender();
      // Crop to get cell with custom foreground color (A at 0,1 with color C)
      const cropped = cropRender(rendered, { x: 0, y: 1, width: 1, height: 1 });

      expect(cropped.color[0]).toBe("C");
      checkBoardRender(cropped);
    });

    it("preserves background color when cropping", () => {
      const rendered = createTestRender();
      // Crop to get cell with custom background color (B at 2,1 with bg_color A)
      const cropped = cropRender(rendered, { x: 2, y: 1, width: 1, height: 1 });

      expect(cropped.bg_color[0]).toBe("A");
      checkBoardRender(cropped);
    });

    it("preserves both colors on CJK character when cropping", () => {
      const rendered = createTestRender();
      // Crop to get CJK with custom colors (中 at 0,2 with color D, bg_color B)
      const cropped = cropRender(rendered, { x: 0, y: 2, width: 2, height: 1 });

      expect(cropped.ch[0]).toBe("中");
      expect(cropped.color[0]).toBe("D");
      expect(cropped.bg_color[0]).toBe("B");
      checkBoardRender(cropped);
    });
  });

  describe("consecutive wide characters", () => {
    it("handles crop in middle of consecutive wide characters", () => {
      const rendered = createTestRender();
      // Row 0 has: 你(0-1)好(2-3)世(4-5)界(6-7)
      // Crop from x=2 to x=6 should get 好世
      const cropped = cropRender(rendered, { x: 2, y: 0, width: 4, height: 1 });

      expect(cropped.w).toBe(4);
      expect(cropped.ch).toContain("好");
      expect(cropped.ch).toContain("世");
      checkBoardRender(cropped);
    });

    it("handles crop splitting multiple wide characters", () => {
      const rendered = createTestRender();
      // Crop from x=1 to x=7 - should clip 你 at start and 界 at end
      const cropped = cropRender(rendered, { x: 1, y: 0, width: 6, height: 1 });

      expect(cropped.w).toBe(6);
      checkBoardRender(cropped, { allowsNarrowerWidth: true });
    });
  });
});
