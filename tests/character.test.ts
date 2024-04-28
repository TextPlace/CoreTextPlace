import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.224.0/assert/mod.ts";

import { getCharacterWidth } from "../mod.ts";

Deno.test("getCharacterWidth ASCII", () => {
  assertEquals(getCharacterWidth("a"), 1);
  assertEquals(getCharacterWidth("A"), 1);
  assertEquals(getCharacterWidth("1"), 1);
  assertEquals(getCharacterWidth("@"), 1);
  assertEquals(getCharacterWidth(" "), 1);

  assertThrows(() => getCharacterWidth(""));
  assertThrows(() => getCharacterWidth("ab"));
});

Deno.test("getCharacterWidth CJK", () => {
  assertEquals(getCharacterWidth("你"), 2);
  assertEquals(getCharacterWidth("好"), 2);
  assertEquals(getCharacterWidth("吗"), 2);

  assertEquals(getCharacterWidth("ガ"), 2);
  assertEquals(getCharacterWidth("ギ"), 2);
  assertEquals(getCharacterWidth("グ"), 2);
  assertEquals(getCharacterWidth("ソ"), 2);

  assertThrows(() => getCharacterWidth("？"));
  assertThrows(() => getCharacterWidth("！"));
  assertThrows(() => getCharacterWidth("你好"));
  assertThrows(() => getCharacterWidth("ヨスガノ"));
});

Deno.test("getCharacterWidth previously faulty cases", () => {
  assertEquals(getCharacterWidth("𤲶"), 2);

  assertThrows(() => getCharacterWidth("𤲶"[0]));
});
