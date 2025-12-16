import { it, expect } from "vitest";

import { getCharacterWidth } from "../src/mod";

it("getCharacterWidth ASCII", () => {
  expect(getCharacterWidth("a")).toBe(1);
  expect(getCharacterWidth("A")).toBe(1);
  expect(getCharacterWidth("1")).toBe(1);
  expect(getCharacterWidth("@")).toBe(1);
  expect(getCharacterWidth(" ")).toBe(1);

  expect(() => getCharacterWidth("")).toThrow();
  expect(() => getCharacterWidth("ab")).toThrow();
});

it("getCharacterWidth CJK", () => {
  expect(getCharacterWidth("你")).toBe(2);
  expect(getCharacterWidth("好")).toBe(2);
  expect(getCharacterWidth("吗")).toBe(2);

  expect(getCharacterWidth("ガ")).toBe(2);
  expect(getCharacterWidth("ギ")).toBe(2);
  expect(getCharacterWidth("グ")).toBe(2);
  expect(getCharacterWidth("ソ")).toBe(2);

  expect(getCharacterWidth("？")).toBe(2);
  expect(getCharacterWidth("！")).toBe(2);
  expect(() => getCharacterWidth("你好")).toThrow();
  expect(() => getCharacterWidth("ヨスガノ")).toThrow();
});

it("getCharacterWidth Emoji", () => {
  expect(getCharacterWidth("👋")).toBe(2);
  expect(getCharacterWidth("🌲️")).toBe(2);
  expect(getCharacterWidth("👨‍👩‍👧‍👦")).toBe(2);
});

it("getCharacterWidth previously faulty cases", () => {
  expect(getCharacterWidth("𤲶")).toBe(2);
});
