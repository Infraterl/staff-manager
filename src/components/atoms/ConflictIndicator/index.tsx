import axios from "axios";
import useSWR from "swr";
import alert from "../../../../public/alert.svg";
import Loader from "../Loader";
import styles from "./styles.module.css";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);
const ConflictIndicator = ({ id }: { id: number }) => {
  const { data, isLoading } = useSWR<{ conflicts: boolean }>(
    `https://front-end-kata.brighthr.workers.dev/api/conflict/${id}`,
    fetcher
  );
  if (isLoading) {
    return (
      <div className={styles.loader}>
        <Loader />
      </div>
    );
  }
  return data?.conflicts ? <img src={alert} alt="Alert" /> : null;
};

export default ConflictIndicator;
