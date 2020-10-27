/// <reference types="jest" />
import sum from "./functions";

test("Adds 2 + 2 to equal 4", () => {
  expect(sum(2, 2)).toBe(4);
});
