import { describe, expect, it } from "vitest";
import { capitalize } from "@/lib/utils";

describe("capitalize", () => {
  it("capitalizes the first letter", () => {
    expect(capitalize("transport")).toBe("Transport");
    expect(capitalize("diet")).toBe("Diet");
  });
});
