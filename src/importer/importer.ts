import { Injectable } from '@nestjs/common';
import { Donation } from 'src/donation/donation.entity';
import { Employee } from 'src/employee/employee.entity';
import { EmployeeService } from 'src/employee/employee.service';
import { Rates } from 'src/rates/rates.entity';
import { RatesService } from 'src/rates/rates.service';

function filterUSDDonation(donations: Donation[]) {
  const filteredByUSD: Donation[] = Object.values(
    donations.filter((d) => d.amount.includes('USD')),
  );

  if (filteredByUSD.length === 0) return [];

  return filteredByUSD.map((d) => {
    d.amount = d.amount.replace('USD', '').replace(' ', '');
    return d;
  });
}

@Injectable()
export class Importer {
  constructor(
    private ratesService: RatesService,
    private employeeService: EmployeeService,
  ) {}

  async importRates(ratesList: Rates[]) {
    const res = {
      uploaded: [],
      errors: [],
    };

    try {
      for (const rate of ratesList) {
        await this.ratesService.createRate(rate);
        res.uploaded.push(rate);
      }
    } catch (err) {
      res.errors.push(err.message);
    }

    return res;
  }

  async importEmployees(employeeList: Employee[]) {
    const res = {
      uploaded: [],
      errors: [],
    };

    try {
      for (const employee of employeeList) {
        if (employee.donations) {
          employee.donations = filterUSDDonation(employee.donations);
        }
      }

      for (const employee of employeeList) {
        await this.employeeService.createEmployee(employee);
        res.uploaded.push(employee);
      }
    } catch (err) {
      res.errors.push(err.message);
    }

    return res;
  }
}
