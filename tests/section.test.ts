import {
  assert,
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.224.0/assert/mod.ts";

import { applyChange, createSection } from "../logic/section.ts";
import type { SectionData } from "../types/section.ts";

Deno.test("section", async (t) => {
  let section: SectionData | undefined;

  await t.step("createSection non-lcm", () => {
    assertThrows(() => {
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
        }
      );
    });
  });

  await t.step("createSection non-origin section", () => {
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
      }
    );

    assertEquals(section.offsetX, 4);
    assertEquals(section.offsetY, 3);
  });

  await t.step("createSection", () => {
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
      }
    );

    assertEquals(section.offsetX, 0);
    assertEquals(section.offsetY, 0);

    function assertSectionContent<T>(
      content: T[][],
      rowCount: number,
      columnCount: number,
      value: T
    ) {
      assertEquals(content.length, rowCount);
      for (const row of content) {
        assertEquals(row.length, columnCount);
        for (const item of row) {
          assertEquals(item, value);
        }
      }
    }

    assertSectionContent(section.ch, 3, 4, " ");
    assertSectionContent(section.color, 3, 4, "F");
    assertSectionContent(section.bgColor, 3, 4, "0");
    assertSectionContent(section.width, 3, 4, 1);
  });

  await t.step("applyChange 1-width", () => {
    assert(section);

    applyChange({ x: 0, y: 0, ch: "t" }, section);
    assertEquals(section.ch[0][0], "t");
    assertEquals(section.ch[0][1], " ");
    assertEquals(section.width[0][0], 1);
  });

  await t.step("applyChange 2-width at a correct position", () => {
    assert(section);

    applyChange({ x: 0, y: 0, ch: "あ" }, section);
    assertEquals(section.ch[0][0], "あ");
    assertEquals(section.ch[0][1], " ");
    assertEquals(section.width[0][0], 2);
  });

  await t.step("applyChange 2-width at an alternate position", () => {
    assert(section);

    applyChange({ x: 1, y: 0, ch: "あ" }, section);
    assertEquals(section.ch[0][0], "あ");
    assertEquals(section.ch[0][1], " ");
    assertEquals(section.width[0][0], 2);
  });
});
