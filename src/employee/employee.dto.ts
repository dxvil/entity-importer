import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { DepartmentDto } from 'src/department/department.dto';
import { DonationDto } from 'src/donation/donation.dto';
import { SalaryDto } from 'src/salary/salary.dto';

export class EmployeeDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  surname: string;
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DepartmentDto)
  department: DepartmentDto;
  @ValidateNested()
  @Type(() => SalaryDto)
  salary: SalaryDto;
  @IsArray()
  @ValidateNested()
  donations: DonationDto[];
}
