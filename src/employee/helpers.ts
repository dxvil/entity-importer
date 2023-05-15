// import { DonationDto } from 'src/donation/donation.dto';
// import { transformDonation } from 'src/donation/helpers/transform-donation-type';
// import { EmployeeDto } from './employee.dto';
// import { EmployeeEntity } from './employee.entity';

// export const transformEmployeeByDonation = (
//   employee: EmployeeEntity,
// ): EmployeeDto => {
//   let transformedEmployee: EmployeeDto = new EmployeeDto();
//   if (employee.donations.length > 0) {
//     const transformedDonations: DonationDto[] = employee.donations.map(
//       (donation) => transformDonation(donation),
//     );

//     transformedEmployee = { ...employee, donations: [...transformedDonations] };

//     return transformedEmployee;
//   }

//   transformedEmployee = { ...employee, donations: [] };

//   return transformedEmployee;
// };

// export const transformListOfEmployeesByDonation = (
//   employees: EmployeeEntity[],
// ): EmployeeDto[] => {
//   return employees.map((employee) => transformEmployeeByDonation(employee));
// };
