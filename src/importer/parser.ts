import { BadRequestException, Injectable } from '@nestjs/common';
import { Department } from 'src/department/department.entity';
import { Donation } from 'src/donation/donation.entity';
import { Employee } from 'src/employee/employee.entity';
import {
  DEPARTMENT,
  DONATION,
  DONATIONS,
  EMPLOYEE,
  PARSING_VALUES,
  RATE,
  SALARY,
  STATEMENT,
} from 'src/employee/employeeConstans';
import { Rates } from 'src/rates/rates.entity';
import { monthesFormat } from 'src/shared/monthes';
import { Statement } from 'src/statement/statement.entity';
import { handleFileUpload } from './helpers/fileUpload';
import { formatData } from './helpers/parseFileExtensions';

@Injectable()
export class Parser {
  parsedFields: string[] = PARSING_VALUES;

  async parseTextFile(file: Express.Multer.File) {
    try {
      await handleFileUpload(file);
      //handless correctly txt, csv, docx -> based on hierarchy and supported fields names
      const fileExt = file.originalname.split('.').pop();
      const format = formatData[fileExt];

      if (!format) {
        throw new BadRequestException(
          `This file extension "${fileExt}" don't support`,
        );
      }

      const data = file.buffer
        .toString()
        .replace(/\n/g, '')
        .split(format.seperator);

      let listKey = 0;
      const listOfEmployees: Employee[] = [];
      const listOfRates: Rates[] = [];
      let currentKey = '';
      let donationKey = 0;
      let salaryKey = 0;
      let ratesKey = 0;

      data.forEach((string, i) => {
        string.trim();

        switch (string) {
          case EMPLOYEE:
            if (listOfEmployees.length !== 0) {
              listKey++;
            }
            currentKey = EMPLOYEE.toLowerCase();
            donationKey = 0;
            salaryKey = 0;
            listOfEmployees.push(new Employee());
            break;
          case DEPARTMENT:
            //add deparment value to employee
            currentKey = DEPARTMENT.toLowerCase();
            listOfEmployees[listKey][currentKey] = new Department();
            break;
          case SALARY:
            //add salary value to employee
            currentKey = SALARY.toLowerCase();
            listOfEmployees[listKey][currentKey] = [];
            break;
          case STATEMENT:
            //add new statement to employee salary
            const category = SALARY.toLowerCase();
            if (listOfEmployees[listKey][category].length !== 0) {
              salaryKey++;
            }
            listOfEmployees[listKey][category].push(new Statement());
            currentKey = STATEMENT.toLowerCase();
            break;
          case DONATION:
            //add donation object
            if (!listOfEmployees[listKey][DONATIONS]) {
              listOfEmployees[listKey][DONATIONS] = [];
            } else {
              donationKey++;
            }
            currentKey = DONATIONS;
            listOfEmployees[listKey][currentKey].push(new Donation());
            break;
          case RATE:
            if (listOfRates.length !== 0) {
              ratesKey++;
            }
            currentKey = RATE.toLowerCase();
            listOfRates.push(new Rates());
            break;
        }

        if (string.includes(':')) {
          //feeling objects with values based on key
          let [key, val]: any = string.split(': ');

          if (key === 'date') {
            let [_, month, day, year] = val.trim().split(' ');
            if (year.match(/[a-zA-Z]/g)) {
              year = year.replace(/[a-zA-Z]/g, '');
            }
            val = new Date(year, monthesFormat[month], day);
          }
          if (key === 'id') {
            val = +val;
          }

          if (currentKey === EMPLOYEE.toLowerCase()) {
            //add values of employee
            listOfEmployees[listKey][key] = val;
          } else if (currentKey === DONATIONS) {
            if (
              !listOfEmployees[listKey][currentKey][donationKey]['employeeId']
            ) {
              listOfEmployees[listKey][currentKey][donationKey]['employeeId'] =
                listOfEmployees[listKey].id;
            }
            listOfEmployees[listKey][currentKey][donationKey][key] = val;
          } else if (currentKey === STATEMENT.toLowerCase()) {
            //add values of statement
            if (
              !listOfEmployees[listKey][SALARY.toLowerCase()][salaryKey][
                'employeeId'
              ]
            ) {
              listOfEmployees[listKey][SALARY.toLowerCase()][salaryKey][
                'employeeId'
              ] = listOfEmployees[listKey].id;
            }
            listOfEmployees[listKey][SALARY.toLowerCase()][salaryKey][key] =
              val;
          } else if (currentKey === RATE.toLowerCase()) {
            listOfRates[ratesKey][key] = val;
          } else {
            //add other values to object that don't base on special structure
            listOfEmployees[listKey][currentKey][key] = val;
          }
        }

        if (
          i !== 0 &&
          string &&
          !this.parsedFields.some((str) =>
            string.toLowerCase().includes(str.toLowerCase()),
          )
        ) {
          throw new BadRequestException({
            message: `Please, check the correctness form of file`,
            errorObj: string,
          });
        }
      });
      return [listOfRates, listOfEmployees];
    } catch (err) {
      return err;
    }
  }
}
