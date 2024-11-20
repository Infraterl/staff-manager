import styles from "./styles.module.css";

function Loader({ className }: { className?: string }) {
  return (
    <output className={`${styles.loader} ${className ?? ""}`}>
      <div className={styles.spinner}></div>
    </output>
  );
}

export default Loader;
