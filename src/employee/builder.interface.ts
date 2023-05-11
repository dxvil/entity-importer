import { IBuilder } from 'src/common/interfaces/builder.interface';

export interface IEmployeeBuilder extends IBuilder {
  buildEmployee();
  endBuildEmployee();
  buildSalary();
  endBuildSalary();
  buildDonations();
  endBuildDonations();
}
