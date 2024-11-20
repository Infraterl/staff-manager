import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AbsenceCard from ".";

describe("AbsenceCard Component", () => {
  it("renders the absence details correctly", () => {
    const mockAbsence = {
      id: 1,
      absenceType: "SICK_LEAVE",
      approved: true,
      days: 5,
      startDate: "2023-11-20",
      employee: {
        firstName: "John",
        lastName: "Smith",
        id: "abc1",
      },
    };

    const { getByText } = render(<AbsenceCard absence={mockAbsence} />);

    const startDate = getByText("20/11/2023");
    expect(startDate).toBeInTheDocument();

    const endDate = getByText("25/11/2023");
    expect(endDate).toBeInTheDocument();

    const approvalStage = getByText("Approved");
    expect(approvalStage).toBeInTheDocument();

    const absenceType = getByText("SICK LEAVE");
    expect(absenceType).toBeInTheDocument();
  });

  it("displays 'Pending' when absence is not approved", () => {
    const mockAbsence = {
      id: 2,
      absenceType: "ANNUAL_LEAVE",
      approved: false,
      days: 3,
      startDate: "2023-11-15",
      employee: {
        firstName: "John",
        lastName: "Smith",
        id: "abc1",
      },
    };

    const { getByText } = render(<AbsenceCard absence={mockAbsence} />);

    const approvalStage = getByText("Pending");
    expect(approvalStage).toBeInTheDocument();
  });

  it("renders '-' when the start date is missing", () => {
    const mockAbsence = {
      id: 3,
      absenceType: "MATERNITY_LEAVE",
      approved: false,
      days: 10,
      startDate: "",
      employee: {
        firstName: "John",
        lastName: "Smith",
        id: "abc1",
      },
    };

    const { getByText } = render(<AbsenceCard absence={mockAbsence} />);

    const startDate = getByText("-");
    expect(startDate).toBeInTheDocument();
  });

  it("formats absence type by replacing underscores with spaces", () => {
    const mockAbsence = {
      id: 4,
      absenceType: "PATERNITY_LEAVE",
      approved: true,
      days: 7,
      startDate: "2023-11-10",
      employee: {
        firstName: "John",
        lastName: "Smith",
        id: "abc1",
      },
    };

    const { getByText } = render(<AbsenceCard absence={mockAbsence} />);

    const absenceType = getByText("PATERNITY LEAVE");
    expect(absenceType).toBeInTheDocument();
  });
});
