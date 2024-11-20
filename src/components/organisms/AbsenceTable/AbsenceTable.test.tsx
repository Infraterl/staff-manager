import { render, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import useSWR from "swr";
import AbsenceTable from ".";

vi.mock("swr");

describe("AbsenceTable Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  vi.mocked(useSWR).mockReturnValue({
    data: undefined,
    isLoading: false,
    error: { message: "Failed to fetch" },
    mutate: vi.fn(),
    isValidating: false,
  });

  it("renders the loader while data is loading", () => {
    vi.mocked(useSWR).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
      mutate: vi.fn(),
      isValidating: false,
    });

    const { getByRole } = render(<AbsenceTable />);
    expect(getByRole("status")).toBeInTheDocument();
  });

  it("renders an error message if there's an error", () => {
    vi.mocked(useSWR).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { message: "Failed to fetch" },
      mutate: vi.fn(),
      isValidating: false,
    });

    const { getByText } = render(<AbsenceTable />);
    expect(getByText("Failed to fetch")).toBeInTheDocument();
  });

  it("renders the absence table with rows", async () => {
    const mockData = [
      {
        id: "1",
        startDate: "2023-11-20",
        days: 5,
        employee: { id: "e1", firstName: "John", lastName: "Doe" },
        absenceType: "SICK_LEAVE",
        approved: true,
      },
      {
        id: "2",
        startDate: "2023-11-15",
        days: 3,
        employee: { id: "e2", firstName: "Jane", lastName: "Smith" },
        absenceType: "ANNUAL_LEAVE",
        approved: false,
      },
    ];

    vi.mocked(useSWR).mockReturnValue({
      data: mockData,
      error: undefined,
      isLoading: false,
      mutate: vi.fn(),
      isValidating: false,
    });

    const { getByText } = render(<AbsenceTable />);

    expect(getByText("John Doe")).toBeInTheDocument();
    expect(getByText("Jane Smith")).toBeInTheDocument();
    expect(getByText("SICK LEAVE")).toBeInTheDocument();
    expect(getByText("ANNUAL LEAVE")).toBeInTheDocument();
  });

  it("sorts the data when a sorter is selected", async () => {
    const mockData = [
      {
        id: "1",
        startDate: "2023-11-20",
        days: 5,
        employee: { id: "e1", firstName: "John", lastName: "Doe" },
        absenceType: "ANNUAL_LEAVE",
        approved: true,
      },
      {
        id: "2",
        startDate: "2023-11-15",
        days: 3,
        employee: { id: "e2", firstName: "Ben", lastName: "Smith" },
        absenceType: "SICK_LEAVE",
        approved: false,
      },
      {
        id: "3",
        startDate: "2022-11-15",
        days: 3,
        employee: { id: "e3", firstName: "Zen", lastName: "James" },
        absenceType: "MATERNITY",
        approved: false,
      },
    ];

    vi.mocked(useSWR).mockReturnValue({
      data: mockData,
      error: undefined,
      isLoading: false,
      mutate: vi.fn(),
      isValidating: false,
    });

    const { getByLabelText, getAllByRole } = render(<AbsenceTable />);

    const sorter = getByLabelText("Sort by:");

    await userEvent.selectOptions(sorter, "Start dates (Most Recent)");

    await waitFor(() => {
      const rows = getAllByRole("row");
      expect(rows[1]).toHaveTextContent("Zen James"); // Sorted by earliest date first
      expect(rows[2]).toHaveTextContent("Ben Smith");
      expect(rows[3]).toHaveTextContent("John Doe");
    });

    await userEvent.selectOptions(sorter, "Name (Alphabetical Order)");

    await waitFor(() => {
      const rows = getAllByRole("row");
      expect(rows[1]).toHaveTextContent("Ben Smith"); // Sorted by Alphabet
      expect(rows[2]).toHaveTextContent("John Doe");
      expect(rows[3]).toHaveTextContent("Zen James");
    });

    await userEvent.selectOptions(sorter, "Absence Type (Alphabetical Order)");

    await waitFor(() => {
      const rows = getAllByRole("row");
      expect(rows[1]).toHaveTextContent("John Doe");
      expect(rows[2]).toHaveTextContent("Zen James");
      expect(rows[3]).toHaveTextContent("Ben Smith"); // Sorted by Alphabet
    });
  });

  it("opens the modal when a name is clicked", async () => {
    const mockData = [
      {
        id: "1",
        startDate: "2023-11-20",
        days: 5,
        employee: { id: "e1", firstName: "John", lastName: "Doe" },
        absenceType: "SICK_LEAVE",
        approved: true,
      },
    ];

    vi.mocked(useSWR).mockReturnValue({
      data: mockData,
      error: undefined,
      isLoading: false,
      mutate: vi.fn(),
      isValidating: false,
    });

    const { getByText } = render(<AbsenceTable />);

    const nameButton = getByText("John Doe");
    fireEvent.click(nameButton);

    await waitFor(() => {
      expect(getByText("John Doe")).toBeInTheDocument();
      expect(getByText("SICK LEAVE")).toBeInTheDocument();
    });
  });
});
