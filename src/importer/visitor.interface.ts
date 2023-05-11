export interface IEmployeeVisitor {
  currentVisit: string;
  visitDepartment();
  visitDonation();
  visitSalary();
  visitEmployee();
  visit(visit: string);
  end();
}
