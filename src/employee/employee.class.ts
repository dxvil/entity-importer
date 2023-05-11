import { Department } from 'src/department/department.entity';
import { Donation } from 'src/donation/donation.entity';
import { Statement } from 'src/statement/statement.entity';

export class Employee {
  id: number;
  name: string;
  surname: string;
  department: Department;
  salary: Statement[];
  donations: Donation[];

  setId(id: number) {
    this.id = id;
  }

  getId(): number {
    return this.id;
  }

  setName(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  setSurname(surname: string) {
    this.surname = surname;
  }

  getSurname(): string {
    return this.surname;
  }

  setDepartment(department: Department) {
    this.department = department;
  }

  getDepatment(): Department {
    return this.department;
  }

  setSalary(salary: Statement[]) {
    this.salary = salary;
  }

  getSalary(): Statement[] {
    return this.salary;
  }

  setDonations(donations: Donation[]) {
    this.donations = donations;
  }

  getDonations(): Donation[] {
    return this.donations;
  }
}
