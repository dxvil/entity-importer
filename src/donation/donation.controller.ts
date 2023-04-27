import { Controller, Get } from '@nestjs/common';
import { DepartmentService } from 'src/department/department.service';
import { EmployeeService } from 'src/employee/employee.service';
import { Statement } from 'src/statement/statement.entity';
import { DonationService } from './donation.service';

@Controller('donations')
export class DonationController {
  constructor(
    private donationService: DonationService,
    private employeesService: EmployeeService,
    private depertmentService: DepartmentService,
  ) {}

  @Get('/reward')
  async getDonationsStat() {
    const totalDonationPool = 10000;
    const totalDonationsOver100 =
      await this.donationService.countTotalDonationsOver100();

    const rewards = await this.donationService.countRewardsForDonators(
      totalDonationsOver100.sum,
    );

    let totalRewards = 0;
    const rewardsToUpdate = rewards.map((r) => {
      const reward = Math.floor(totalDonationPool * parseFloat(r.share));
      const statement: Statement = {
        amount: reward,
        date: new Date(),
        employeeId: r.id,
        id: Math.floor(100000 + Math.random() * 900000),
      };
      totalRewards += reward;
      return {
        id: r.id,
        reward: statement,
      };
    });

    const rewardedEmployees = {
      totalRewards,
      rewarded: [],
      rewardedTopDepartment: [],
      error: [],
    };

    for (const reward of rewardsToUpdate) {
      const employee = await this.employeesService.findEmployee(reward.id);
      if (employee) {
        employee.salary.push(reward.reward);
        try {
          await this.employeesService.updateEmployee(employee);
          rewardedEmployees.rewarded.push(employee);
        } catch (e) {
          rewardedEmployees.error.push(employee.id);
        }
      }
    }

    const departmentWithTheHighestDonatePerPerson =
      await this.depertmentService.departmentWithTheHighestDonatePerPerson();

    if (departmentWithTheHighestDonatePerPerson) {
      const departmentToReward = await this.depertmentService.findDepartment(
        departmentWithTheHighestDonatePerPerson.id,
      );

      for (const employee of departmentToReward.employees) {
        const statement: Statement = {
          amount: 100,
          date: new Date(),
          employeeId: employee.id,
          id: Math.floor(100000 + Math.random() * 900000),
        };
        totalRewards += 100;
        employee.salary.push(statement);

        try {
          await this.employeesService.updateEmployee(employee);
          rewardedEmployees.rewardedTopDepartment.push(employee);
        } catch (e) {
          rewardedEmployees.error.push(employee.id);
        }
      }

      return rewardedEmployees;
    }
  }
}
