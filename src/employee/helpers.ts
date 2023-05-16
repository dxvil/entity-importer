import { transformDonation } from 'src/donation/helpers/transform-donation-type';
import { EmployeeEntity } from './employee.entity';
import { Donation } from 'src/donation/donation.entity';

export const transformEmployeeByDonation = (
  employee: EmployeeEntity,
): EmployeeEntity => {
  let transformedEmployee: EmployeeEntity = { ...employee };
  if (employee.donations.length > 0) {
    const transformedDonations: Donation[] = employee.donations.map(
      (donation) => transformDonation(donation),
    );

    transformedEmployee.donations = [...transformedDonations];

    return transformedEmployee;
  }

  transformedEmployee = { ...employee, donations: [] };

  return transformedEmployee;
};

export const transformListOfEmployeesByDonation = (
  employees: EmployeeEntity[],
): EmployeeEntity[] => {
  return employees.map((employee) => transformEmployeeByDonation(employee));
};
