import { describe, it, expect } from "vitest";

import { applyChange, createSection } from "../src/logic/section";
import type { SectionData } from "../src/types/section";

describe("section", () => {
  let section: SectionData | undefined;

  it("createSection non-lcm", () => {
    expect(() => {
      createSection(
        { sx: 0, sy: 0 },
        {
          xSections: 2,
          ySections: 2,
          sectionWidth: 3,
          sectionHeight: 3,
          defaultCh: " ",
          defaultColor: "F",
          defaultBgColor: "0",
          defaultWidth: 1,
        },
      );
    }).toThrow();
  });

  it("createSection non-origin section", () => {
    section = createSection(
      { sx: 1, sy: 1 },
      {
        xSections: 2,
        ySections: 2,
        sectionWidth: 4,
        sectionHeight: 3,
        defaultCh: " ",
        defaultColor: "F",
        defaultBgColor: "0",
        defaultWidth: 1,
      },
    );

    expect(section.offsetX).toBe(4);
    expect(section.offsetY).toBe(3);
  });

  it("createSection", () => {
    section = createSection(
      { sx: 0, sy: 0 },
      {
        xSections: 2,
        ySections: 2,
        sectionWidth: 4,
        sectionHeight: 3,
        defaultCh: " ",
        defaultColor: "F",
        defaultBgColor: "0",
        defaultWidth: 1,
      },
    );

    expect(section.offsetX).toBe(0);
    expect(section.offsetY).toBe(0);

    function assertSectionContent<T>(
      content: T[][],
      rowCount: number,
      columnCount: number,
      value: T,
    ) {
      expect(content.length).toBe(rowCount);
      for (const row of content) {
        expect(row.length).toBe(columnCount);
        for (const item of row) {
          expect(item).toBe(value);
        }
      }
    }

    assertSectionContent(section.ch, 3, 4, " ");
    assertSectionContent(section.color, 3, 4, "F");
    assertSectionContent(section.bgColor, 3, 4, "0");
    assertSectionContent(section.width, 3, 4, 1);
  });

  it("applyChange 1-width", () => {
    expect(section).toBeDefined();

    applyChange({ x: 0, y: 0, ch: "t" }, section!);
    expect(section!.ch[0]).toEqual(["t", " ", " ", " "]);
    expect(section!.ch[1]).toEqual([" ", " ", " ", " "]);
    expect(section!.width[0]).toEqual([1, 1, 1, 1]);
  });

  it("applyChange 1-width at odd position", () => {
    expect(section).toBeDefined();

    applyChange({ x: 1, y: 0, ch: "t" }, section!);
    expect(section!.ch[0]).toEqual(["t", "t", " ", " "]);
    expect(section!.width[0]).toEqual([1, 1, 1, 1]);
  });

  it("applyChange 2-width at a correct position", () => {
    expect(section).toBeDefined();

    applyChange({ x: 0, y: 0, ch: "あ" }, section!);
    expect(section!.ch[0]).toEqual(["あ", "t", " ", " "]);
    expect(section!.width[0]).toEqual([2, 1, 1, 1]);
  });

  it("applyChange 2-width at an alternate position", () => {
    expect(section).toBeDefined();

    applyChange({ x: 1, y: 0, ch: "あ" }, section!);
    expect(section!.ch[0]).toEqual(["あ", "t", " ", " "]);
    expect(section!.width[0]).toEqual([2, 1, 1, 1]);
  });

  it("applyChange incorrect section", () => {
    expect(section).toBeDefined();

    expect(() => {
      applyChange({ x: 6, y: 3, ch: "あ" }, section!);
    }).toThrow();
  });
});
