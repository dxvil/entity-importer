import { Injectable } from '@nestjs/common';
import { Department } from 'src/department/department.entity';
import { Donation } from 'src/donation/donation.entity';
import { Employee } from 'src/employee/employee.class';
import { Statement } from 'src/statement/statement.entity';
import { IEmployeeBuilder } from './builder.interface';

@Injectable()
export class EmployeeBuilder implements IEmployeeBuilder {
  employees: Employee[];
  currentEmployee: null | Employee;
  currentInsertion: null | Statement | Donation | Department;
  department: null | Department;
  salary: Statement[];
  donations: Donation[];

  constructor() {
    this.employees = [];
    this.currentEmployee = null;
    this.currentInsertion = null;
    this.salary = [];
    this.donations = [];
  }

  setDepartment(department: Department) {
    this.department = department;
  }

  setDonation(donation: Donation) {
    this.donations.push(donation);
  }

  setSalary(statement: Statement) {
    this.salary.push(statement);
  }

  buildEmployee() {
    this.currentEmployee = new Employee();
  }

  endBuildEmployee() {
    this.currentEmployee.setDepartment(this.department);
    this.currentEmployee.setDonations(this.donations);
    this.currentEmployee.setSalary(this.salary);

    this.employees.push(this.currentEmployee);

    this.currentEmployee = null;
    this.department = null;
    this.donations = [];
    this.salary = [];
  }

  buildSalary() {
    this.currentInsertion = new Statement();
  }

  endBuildSalary() {
    if (this.currentInsertion instanceof Statement) {
      this.setSalary(this.currentInsertion);
      this.currentInsertion = null;
    }
  }

  buildDonations() {
    this.currentInsertion = new Donation();
  }

  endBuildDonations() {
    if (this.currentInsertion instanceof Donation) {
      this.setDonation(this.currentInsertion);
      this.currentInsertion = null;
    }
  }

  buildDepartment() {
    this.currentInsertion = new Department();
  }

  endBuildDepartment() {
    if (this.currentInsertion instanceof Department) {
      this.setDepartment(this.currentInsertion);
      this.currentInsertion = null;
    }
  }

  valueInsertion(key: any, value: any) {
    if (this.currentInsertion === null) {
      this.currentEmployee[key] = value;
    } else {
      this.currentInsertion[key] = value;
    }
  }

  build() {
    return this.employees;
  }
}
