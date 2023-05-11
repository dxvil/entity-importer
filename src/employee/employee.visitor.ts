import { Injectable } from '@nestjs/common';
import { Department } from 'src/department/department.entity';
import { Donation } from 'src/donation/donation.entity';
import {
  DEPARTMENT,
  DONATION,
  EMPLOYEE,
  PARSING_VALUES,
  STATEMENT,
} from 'src/employee/employeeConstans';
import { Statement } from 'src/statement/statement.entity';
import { IEmployeeVisitor } from '../importer/visitor.interface';
import { EmployeeBuilder } from './employee.builder';

@Injectable()
export class EmployeeVisitor implements IEmployeeVisitor {
  prevVisit: string;
  currentVisit: string;

  constructor(private employeeBuilder: EmployeeBuilder) {}

  setCurrentVisit(currentVisit: string) {
    this.currentVisit = currentVisit;
  }

  getCurrentVisit() {
    return this.currentVisit;
  }

  setPrevVisit(prevVisit: string) {
    this.prevVisit = prevVisit;
  }

  getPrevVisit() {
    return this.prevVisit;
  }

  visitDepartment() {
    this.employeeBuilder.buildDepartment();
  }

  visitDonation() {
    this.employeeBuilder.buildDonations();
  }

  visitSalary() {
    this.employeeBuilder.buildSalary();
  }

  visitEmployee() {
    this.employeeBuilder.buildEmployee();
  }

  visitValueInsertion(key: any, value: any) {
    this.employeeBuilder.valueInsertion(key, value);
  }

  visit(visit: string, key?: any, value?: any) {
    this.setPrevVisit(this.currentVisit);
    this.endVisit(visit);

    switch (visit) {
      case EMPLOYEE:
        this.visitEmployee();
        this.setCurrentVisit(visit);
        break;
      case DEPARTMENT:
        this.visitDepartment();
        this.setCurrentVisit(visit);
        break;
      case STATEMENT:
        this.visitSalary();
        this.setCurrentVisit(visit);
        break;
      case DONATION:
        this.visitDonation();
        this.setCurrentVisit(visit);
        break;
      case ':':
        this.visitValueInsertion(key, value);
        this.setCurrentVisit(':');
        break;
    }
  }

  endVisit(visit: string) {
    //if it's end of file
    if (visit === 'END') {
      //if any insertions is not closed, then close
      if (this.employeeBuilder.currentInsertion) {
        this.visitEndByInstance();
      }
      //close last employee
      this.employeeBuilder.endBuildEmployee();
      return;
    }

    //if new employee, close prev one
    if (this.prevVisit && visit === EMPLOYEE) {
      if (this.employeeBuilder.currentInsertion) {
        this.visitEndByInstance();
      }
      this.employeeBuilder.endBuildEmployee();
    }

    //this is basically a check, that the previous value was a value of insertion, and
    // the new key is a new insertion
    // that's mean we need to close a previous insertion because it's already filled with it values
    if (
      visit &&
      this.prevVisit &&
      this.prevVisit === ':' &&
      PARSING_VALUES.includes(visit) &&
      this.prevVisit !== visit
    ) {
      this.visitEndByInstance();
    }
  }

  visitEndByInstance() {
    if (this.employeeBuilder.currentInsertion instanceof Department) {
      this.employeeBuilder.endBuildDepartment();
      return;
    }

    if (this.employeeBuilder.currentInsertion instanceof Statement) {
      this.employeeBuilder.endBuildSalary();
      return;
    }

    if (this.employeeBuilder.currentInsertion instanceof Donation) {
      this.employeeBuilder.endBuildDonations();
      return;
    }
  }

  end() {
    return this.employeeBuilder.build();
  }
}
