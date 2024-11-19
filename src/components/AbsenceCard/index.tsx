import { Absence } from "@/types/Absences";

import styles from "./styles.module.css";

interface AbsenceCardProps {
  absence: Absence;
}

function AbsenceCard({ absence }: AbsenceCardProps) {
  const { absenceType, approved, days, startDate } = absence;

  const leaveDate = new Date(startDate);
  const formattedStartDate = leaveDate?.toLocaleDateString("en-GB");
  const date = new Date(startDate);
  date.setDate(date.getDate() + days);
  const formattedEndDate = date?.toLocaleDateString("en-GB");
  return (
    <div className={styles["card-container"]}>
      <div>
        <p>
          <label htmlFor="start-date">Start date:</label>{" "}
          <span id="start-date">{formattedStartDate || "-"}</span>
        </p>
        <p>
          <label htmlFor="end-date">End date:</label>{" "}
          <span id="end-date">{formattedEndDate}</span>
        </p>
        <p>
          <label htmlFor="approval-stage">Approval stage:</label>{" "}
          <span id="approval-stage">{approved ? "Approved" : "Pending"}</span>
        </p>
        <p>
          <label htmlFor="absence-type">Absence type:</label>{" "}
          <span id="absence-type">{absenceType.replace(/_/g, " ")}</span>
        </p>
      </div>
    </div>
  );
}

export default AbsenceCard;
