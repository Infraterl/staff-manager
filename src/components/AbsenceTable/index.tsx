import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import useSWR from "swr";
import { Absence } from "@/types/Absences";
import styles from "./styles.module.css";
import Modal from "@/components/Modal";
import { useRef } from "react";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const AbsenceTable = () => {
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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <h1>Absence List</h1>
      <div>LIST</div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Employee name</TableCell>
              <TableCell align="right">Start date</TableCell>
              <TableCell align="right">End date</TableCell>
              <TableCell align="right">Absence type</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {absenceData.map((row: Absence) => {
              const { startDate, days, employee, absenceType, approved } = row;
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
                      onClick={() => showModal()}
                    >{`${employee.firstName} ${employee.lastName}`}</button>
                  </TableCell>
                  <TableCell align="right">{formattedStartDate}</TableCell>
                  <TableCell align="right">{formattedEndDate}</TableCell>
                  <TableCell align="right">{absenceType}</TableCell>
                  <TableCell align="right">
                    {approved ? "Approved" : "Pending"}
                  </TableCell>
                  ;
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal ref={modal}>Info</Modal>
    </>
  );
};

export default AbsenceTable;
