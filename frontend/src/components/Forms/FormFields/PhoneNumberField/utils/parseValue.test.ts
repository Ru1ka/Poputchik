import { describe, test, expect } from "vitest";
import { parseValue } from "./parseValue";

describe("parseValue works correctly", () => {
    test("if parseValue parse empty value, the result must be '+7 '", () => {
        const value = parseValue("");

        expect(value).toBe("+7 ");
    });
});
