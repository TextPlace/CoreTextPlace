import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

import { createSection } from "../logic/section.ts";

Deno.test("createSection", () => {
  const section = createSection(
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

  assertEquals(section.offsetX, 0);
  assertEquals(section.offsetY, 0);
  assertEquals(section.ch.length, 3);
  for (const row of section.ch) {
    assertEquals(row.length, 3);
    for (const ch of row) {
      assertEquals(ch, " ");
    }
  }

  assertEquals(section.color.length, 3);
  for (const row of section.color) {
    assertEquals(row.length, 3);
    for (const color of row) {
      assertEquals(color, "F");
    }
  }

  assertEquals(section.bgColor.length, 3);
  for (const row of section.bgColor) {
    assertEquals(row.length, 3);
    for (const bgColor of row) {
      assertEquals(bgColor, "0");
    }
  }

  assertEquals(section.width.length, 3);
  for (const row of section.width) {
    assertEquals(row.length, 3);
    for (const width of row) {
      assertEquals(width, 1);
    }
  }
});
