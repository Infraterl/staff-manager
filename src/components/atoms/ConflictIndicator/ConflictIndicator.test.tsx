import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ConflictIndicator from ".";
import useSWR from "swr";

vi.mock("swr");

describe("ConflictIndicator Component", () => {
  it("renders a loader while loading", () => {
    vi.mocked(useSWR).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
      mutate: vi.fn(),
      isValidating: false,
    });

    const { getByRole } = render(<ConflictIndicator id={1} />);

    expect(getByRole("status")).toBeInTheDocument();
  });

  it("renders the alert image when conflicts are true", () => {
    vi.mocked(useSWR).mockReturnValue({
      data: { conflicts: true },
      isLoading: false,
      error: undefined,
      mutate: vi.fn(),
      isValidating: false,
    });

    const { getByAltText } = render(<ConflictIndicator id={1} />);

    const alertImage = getByAltText("Alert");
    expect(alertImage).toBeInTheDocument();
  });

  it("renders nothing when conflicts are false", () => {
    vi.mocked(useSWR).mockReturnValue({
      data: { conflicts: false },
      isLoading: false,
      error: undefined,
      mutate: vi.fn(),
      isValidating: false,
    });

    const { container } = render(<ConflictIndicator id={1} />);

    expect(container).toBeEmptyDOMElement();
  });
});
