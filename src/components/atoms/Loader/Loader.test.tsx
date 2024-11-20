import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Loader from ".";
import styles from "./styles.module.css";

describe("Loader Component", () => {
  it("renders the loader container", () => {
    const { getByRole } = render(<Loader />);

    const loaderContainer = getByRole("status");

    expect(loaderContainer).toBeInTheDocument();
    expect(loaderContainer).toHaveClass(styles.loader);
  });

  it("renders the spinner element", () => {
    render(<Loader />);

    const spinner = document.querySelector(`.${styles.spinner}`);

    expect(spinner).toBeInTheDocument();
  });

  it("applies additional className when provided", () => {
    const { getByRole } = render(<Loader className="custom-class" />);

    const loaderContainer = getByRole("status");

    expect(loaderContainer).toHaveClass(styles.loader);
    expect(loaderContainer).toHaveClass("custom-class");
  });

  it("does not add undefined to the class list", () => {
    const { getByRole } = render(<Loader className={undefined} />);

    const loaderContainer = getByRole("status");

    expect(loaderContainer.className).not.toContain("undefined");

    render(<Loader className={undefined} />);

    expect(loaderContainer.className).not.toContain("null");
  });
});
