import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Loader from "../../atoms/Loader";
import axios from "axios";
import useSWR from "swr";
import { Absence } from "@/types/Absences";
import styles from "./styles.module.css";
import Modal from "../../atoms/Modal";
import { useRef, useState } from "react";
import AbsenceCard from "../../atoms/AbsenceCard";
import { SorterOptions } from "../../../types/SorterOptions";
import ConflictIndicator from "../../atoms/ConflictIndicator";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const AbsenceTable = () => {
  const [employeeAbsences, setEmployeeAbsences] = useState<Absence[]>([]);
  const [selectedSorter, setSelectedSorter] = useState<
    SorterOptions | "default"
  >("default");
  const [sortedData, setSortedData] = useState<Absence[] | null>(null);
  const {
    data: absenceData,
    error,
    isLoading,
  } = useSWR(
    "https://front-end-kata.brighthr.workers.dev/api/absences",
    fetcher
  );

  const modal = useRef<HTMLDialogElement | null>(null);
  const showModal = () => {
    modal?.current?.showModal();
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sorter = event?.target?.value as SorterOptions;
    setSelectedSorter(sorter);
    let sorted = [...(absenceData || [])];
    switch (sorter) {
      case SorterOptions.DATES:
        sorted = sorted.sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
        break;
      case SorterOptions.TYPE:
        sorted = sorted.sort((a, b) =>
          a.absenceType.localeCompare(b.absenceType)
        );
        break;
      case SorterOptions.NAME:
        sorted = sorted.sort((a, b) =>
          a.employee.firstName.localeCompare(b.employee.firstName)
        );
        break;
    }
    setSortedData(sorted);
  };

  const finalData = sortedData ?? absenceData;

  const handleNameClick = (id: string) => {
    const employeeAbsences = absenceData.filter((data: Absence) => {
      return data.employee.id === id;
    });
    setEmployeeAbsences(employeeAbsences);
  };
  if (isLoading) {
    return (
      <div className={styles.loader}>
        <Loader />
      </div>
    );
  }
  if (error) {
    return (
      <div className={styles.error}>
        <p>{error?.message}</p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <h1>Absence Table</h1>
      <div className={styles.sorter}>
        <label htmlFor="sort-by">Sort by: </label>
        <select
          name="sort-by"
          id="sort-by"
          value={selectedSorter}
          onChange={handleChange}
        >
          <option value="default" disabled>
            Select an option
          </option>
          <option value={SorterOptions.DATES}>Start dates (Most Recent)</option>
          <option value={SorterOptions.TYPE}>
            Absence Type (Alphabetical Order)
          </option>
          <option value={SorterOptions.NAME}>Name (Alphabetical Order)</option>
        </select>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Employee name</TableCell>
              <TableCell align="right">Start date</TableCell>
              <TableCell align="right">End date</TableCell>
              <TableCell align="right">Absence type</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Conflicts</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {finalData.map((row: Absence) => {
              const { startDate, days, employee, absenceType, approved, id } =
                row;
              const formattedStartDate = new Date(startDate).toLocaleDateString(
                "en-GB"
              );
              const date = new Date(row.startDate);
              date.setDate(date.getDate() + days);
              const formattedEndDate = date?.toLocaleDateString("en-GB");

              return (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <button
                      className={styles.name}
                      onClick={() => {
                        handleNameClick(employee.id);
                        showModal();
                      }}
                    >{`${employee.firstName} ${employee.lastName}`}</button>
                  </TableCell>
                  <TableCell align="right">{formattedStartDate}</TableCell>
                  <TableCell align="right">{formattedEndDate}</TableCell>
                  <TableCell align="right">
                    {absenceType.replace(/_/g, " ")}
                  </TableCell>
                  <TableCell align="right">
                    {approved ? "Approved" : "Pending"}
                  </TableCell>
                  <TableCell align="right">
                    <ConflictIndicator id={id} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal ref={modal}>
        <div className={styles.modalContent}>
          <h1>{`${employeeAbsences?.[0]?.employee?.firstName} ${employeeAbsences?.[0]?.employee?.lastName}`}</h1>
          <div className={styles.cards}>
            {employeeAbsences.map((absence) => (
              <AbsenceCard key={absence.id} absence={absence} />
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AbsenceTable;
