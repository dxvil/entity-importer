import { BadRequestException, Injectable } from '@nestjs/common';
import { Department } from 'src/department/department.entity';
import { Donation } from 'src/donation/donation';
import { Employee } from 'src/employee/employee.entity';
import { Statement } from 'src/statement/statement.entity';
import { formatData } from './fileExtensions';

@Injectable()
export class Importer {
  async parseTextFile(file: Express.Multer.File) {
    try {
      await this.handleFileUpload(file);

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
      const listOfEntities: Employee[] = [];
      let currentKey = '';
      let donationKey: null | number = null;
      let salaryKey = 0;

      data.forEach((string, i) => {
        if (string === 'Employee') {
          if (listOfEntities.length !== 0) {
            listKey++;
          }
          currentKey = 'Employee';
          donationKey = null;
          salaryKey = 0;
          listOfEntities.push(new Employee());
        } else if (string.includes(':')) {
          const [key, val] = string.split(':');

          if (currentKey === 'Employee') {
            listOfEntities[listKey][key] = val;
          } else if (currentKey === 'Statement') {
            listOfEntities[listKey]['Salary'][salaryKey][key] = val;
          } else {
            listOfEntities[listKey][currentKey][key] = val;
          }
        } else if (string === 'Department') {
          currentKey = 'Department';
          listOfEntities[listKey][currentKey] = new Department();
        } else if (string === 'Salary') {
          currentKey = 'Salary';
          listOfEntities[listKey][currentKey] = [];
        } else if (string === 'Statement') {
          if (listOfEntities[listKey]['Salary'].length !== 0) {
            salaryKey++;
          }

          listOfEntities[listKey]['Salary'].push(new Statement());

          currentKey = 'Statement';
        } else if (string === 'Donation') {
          donationKey === null ? 0 : donationKey++;

          currentKey = 'Donation' + donationKey;

          listOfEntities[listKey][currentKey] = new Donation();
        } else if (i !== 0 && string) {
          throw new BadRequestException({
            message: `Please, check the correctness form of file`,
            errorObj: string,
          });
        }
      });

      return listOfEntities;
    } catch (err) {
      return err;
    }
  }

  async handleFileUpload(file: Express.Multer.File): Promise<void> {
    return new Promise((resolve, reject) => {
      if (file.size === file.buffer.length) {
        resolve();
      } else {
        reject(new Error('File is not fully uploaded'));
      }
    });
  }
}
