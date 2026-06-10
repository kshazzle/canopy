/**
 * @vitest-environment jsdom
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QuizChoiceStep } from "@/components/QuizChoiceStep";
import { VEHICLE_OPTIONS } from "@/lib/constants";

describe("QuizChoiceStep", () => {
  it("renders options and supports arrow-key navigation", () => {
    const onChange = vi.fn();

    render(
      <QuizChoiceStep
        value="petrol"
        options={VEHICLE_OPTIONS}
        category="transport"
        onChange={onChange}
      />,
    );

    expect(screen.getByRole("radio", { name: /Petrol/i })).toHaveAttribute(
      "aria-checked",
      "true",
    );

    const petrol = screen.getByRole("radio", { name: /Petrol/i });
    fireEvent.keyDown(petrol, { key: "ArrowDown" });

    expect(onChange).toHaveBeenCalledWith("hybrid");
  });
});
