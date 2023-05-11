import { BadRequestException, Injectable } from '@nestjs/common';
import { Employee } from 'src/employee/employee.class';
import {
  ALL_VALID_KEYS,
  EMPLOYEES_PART,
  RATE,
  RATES_PART,
} from 'src/employee/employeeConstans';
import { Rates } from 'src/rates/rates.entity';
import { RatesVisitor } from 'src/rates/rates.visitor';
import { monthesFormat } from 'src/shared/monthes';
import { EmployeeVisitor } from '../employee/employee.visitor';
import { handleFileUpload } from './helpers/fileUpload';
import { formatData } from './helpers/parseFileExtensions';

@Injectable()
export class Parser {
  constructor(
    private employeeVisitor: EmployeeVisitor,
    private ratesVisitor: RatesVisitor,
  ) {}

  async parseTextFile(file: Express.Multer.File): Promise<[Rates[], Employee[]]> {
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
        .split(format.seperator)
        .filter((val) => val);

      //checking on what part of file we are
      let filePartName = EMPLOYEES_PART;

      data.forEach((string) => {
        const isValidKey = ALL_VALID_KEYS.some((key) => string.includes(key));

        if (isValidKey) {
          string.trim();

          if (string === RATE) {
            filePartName = RATES_PART;
          }

          if (string.includes(':')) {
            let [key, value]: any = string.split(': ');

            if (key === 'date') {
              let [_, month, day, year] = value.trim().split(' ');

              if (year.match(/[a-zA-Z]/g)) {
                year = year.replace(/[a-zA-Z]/g, '');
              }

              value = new Date(+year, monthesFormat[month], +day);
            }

            filePartName === EMPLOYEES_PART
              ? this.employeeVisitor.visit(':', key, value)
              : this.ratesVisitor.visitRates(':', key, value);

            return;
          }

          filePartName === EMPLOYEES_PART
            ? this.employeeVisitor.visit(string)
            : this.ratesVisitor.visitRates(string);
        }
      });
      this.employeeVisitor.endVisit('END');
      this.ratesVisitor.endVisit('END');

      return [this.ratesVisitor.end(), this.employeeVisitor.end()];
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
