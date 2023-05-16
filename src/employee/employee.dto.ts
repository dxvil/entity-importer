import { IsNotEmpty, ValidateNested } from 'class-validator';
import { DepartmentDto } from 'src/department/department.dto';
import { DonationDto } from 'src/donation/donation.dto';
import { StatementDto } from 'src/statement/statement.dto';

export class EmployeeDto {
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  surname: string;
  @IsNotEmpty()
  @ValidateNested()
  department: DepartmentDto;
  @ValidateNested()
  salary: StatementDto[];
  @ValidateNested()
  donations: DonationDto[];
}
