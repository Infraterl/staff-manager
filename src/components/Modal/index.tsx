import { forwardRef, ForwardedRef } from "react";
import { createPortal } from "react-dom";

import styles from "./styles.module.css";

interface IModal {
  children: React.ReactNode;
}

const Modal = forwardRef(function Modal(
  { children }: IModal,
  ref: ForwardedRef<HTMLDialogElement>
) {
  const modalContainer = document.getElementById("modal");

  if (!modalContainer) {
    return null;
  }

  return createPortal(
    <dialog ref={ref} className={styles["modal-container"]}>
      {children}
      <form method="dialog">
        <button autoFocus>Close</button>
      </form>
    </dialog>,
    modalContainer
  );
});

export default Modal;
