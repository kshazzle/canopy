import { describe, expect, it } from "vitest";
import { z } from "zod";
import { parseOrNull } from "@/lib/validation";

describe("parseOrNull", () => {
  const schema = z.object({ id: z.string().uuid(), count: z.number().int().min(0) });

  it("returns parsed data for valid input", () => {
    const result = parseOrNull(schema, {
      id: "a0000000-0000-4000-8000-000000000001",
      count: 3,
    });
    expect(result).toEqual({
      id: "a0000000-0000-4000-8000-000000000001",
      count: 3,
    });
  });

  it("returns null for invalid input", () => {
    expect(parseOrNull(schema, { id: "bad", count: -1 })).toBeNull();
    expect(parseOrNull(schema, null)).toBeNull();
  });
});
