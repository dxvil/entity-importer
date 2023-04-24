import { BadRequestException, Injectable } from '@nestjs/common';
import { Department } from 'src/department/department.entity';
import { Donation } from 'src/donation/donation';
import { Employee } from 'src/employee/employee.entity';
import { Rates } from 'src/rates/rates.entity';
import { Statement } from 'src/statement/statement.entity';
import { handleFileUpload } from './fileUpload';
import { formatData } from './parseFileExtensions';

@Injectable()
export class Parser {
  parsedFields: string[] = [
    'Employee',
    'Department',
    'Salary',
    'Statement',
    'Donation',
    'Rates',
    'Rate',
    ':',
  ];
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
      let donationKey: null | number = null;
      let salaryKey = 0;
      let ratesKey = 0;

      data.forEach((string, i) => {
        string.trim();

        switch (string) {
          case 'Employee':
            if (listOfEmployees.length !== 0) {
              listKey++;
            }
            currentKey = 'Employee';
            donationKey = null;
            salaryKey = 0;
            listOfEmployees.push(new Employee());
            break;
          case 'Department':
            //add deparment value to employee
            currentKey = 'Department';
            listOfEmployees[listKey][currentKey] = new Department();
            break;
          case 'Salary':
            //add salary value to employee
            currentKey = 'Salary';
            listOfEmployees[listKey][currentKey] = [];
            break;
          case 'Statement':
            //add new statement to employee salary
            if (listOfEmployees[listKey]['Salary'].length !== 0) {
              salaryKey++;
            }
            listOfEmployees[listKey]['Salary'].push(new Statement());
            currentKey = 'Statement';
            break;
          case 'Donation':
            //add donation object
            donationKey === null ? 0 : donationKey++;
            currentKey = 'Donation' + donationKey;
            listOfEmployees[listKey][currentKey] = new Donation();
            break;
          case 'Rate':
            if (listOfRates.length !== 0) {
              ratesKey++;
            }
            currentKey = 'Rate';
            listOfRates.push(new Rates());
            break;
        }

        if (string.includes(':')) {
          //feeling objects with values based on key
          const [key, val] = string.split(':');

          if (currentKey === 'Employee') {
            //add values of employee
            listOfEmployees[listKey][key] = val;
          } else if (currentKey === 'Statement') {
            //add values of statement
            listOfEmployees[listKey]['Salary'][salaryKey][key] = val;
          } else if (currentKey === 'Rate') {
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
