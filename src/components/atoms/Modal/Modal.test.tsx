import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import Modal from ".";

describe("Modal Component", () => {
  let modalContainer: HTMLElement;

  beforeEach(() => {
    // Set up a mock modal container in the DOM
    modalContainer = document.createElement("div");
    modalContainer.setAttribute("id", "modal");
    document.body.appendChild(modalContainer);
  });

  it("renders the modal in the portal", () => {
    const { getByText } = render(
      <Modal>
        <p>Modal Content</p>
      </Modal>
    );

    const modalContent = getByText("Modal Content");
    expect(modalContent).toBeInTheDocument();
    expect(modalContainer).toContainElement(modalContent);
  });

  it("does not render anything if modal container is missing", () => {
    document.body.removeChild(modalContainer);

    const { container } = render(
      <Modal>
        <p>Modal Content</p>
      </Modal>
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders the close button and Content", () => {
    const { getByText } = render(
      <Modal>
        <p>Modal Content</p>
      </Modal>
    );

    const closeButton = getByText("Close");
    const content = getByText("Modal Content");

    expect(content).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);

    // Assert that no errors are thrown
    // Since the "Close" button uses the dialog element and its method="dialog" attribute that are not fully supported in jsdom
    expect(closeButton).toBeInTheDocument();
  });
});
