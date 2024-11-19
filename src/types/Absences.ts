export interface Absence {
  absenceType: string;
  approved: boolean;
  days: number;
  employee: Employee;
  id: number;
  startDate: string;
}

export interface Employee {
  firstName: string;
  id: string;
  lastName: string;
}
