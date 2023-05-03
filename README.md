# Entity parser and importer
Tech stack: NestJS, TypeORM, MySQL in AWS Cloud
Start DB: 
```
git clone git@github.com:dxvil/entity-importer.git
sudo docker compose up
sudo docker compose exec db bash
mysql -h localhost -u root - P 3306 -p
password
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
```
Start server:
```
npm install
npm run start:dev
```
> In the first version i used AWS RDS but my free tier ended so i replace it with local db in docker

This is a test assignment with described and implemented functionality below:

The system should read files from a folder, parse them, and update a database upon startup. A parser needs to be developed, and a database with relational connections needs to be designed. Additionally, multiple HTTP APIs need to be provided to return query results.

#### File format:

The file is a simple text format representing objects with properties and other nested objects. The hierarchy is determined by indentation (each level has 2 spaces). The type of each object is named with a capital letter, while properties are named with lowercase letters. The file represents a list of employees (Employee), each with basic properties (name, surname, ID). Each employee also belongs to a department (Department) and has a list of statements (Statement) for the year. The salary is determined by date and amount (always in $). Additionally, each employee may have records of charitable donations (Donation), where the donation amount may be in any currency. The file also contains exchange rates (Rate) for all date-currency pairs that were encountered in donations. In the database, it is sufficient to store the equivalent of donations in USD.

#### Queries:
- Find employees who donated more than 10% of their average monthly salary for the last 6 months to charity and sort them by their minimum average annual salary.
```
GET /employees/count-max-donations
```
- Display departments in descending order of the difference between the maximum and minimum average annual salary. For each department, show up to 3 employees with the highest percentage increase in salary for the year and the size of their last salary.
```
GET /departments/stat
```
- Count the number of employees who donated more than $100 to charity. As a one-time reward, each employee will receive an equivalent amount of their contribution from a pool of $10,000. (If an employee donated $200 out of a total donation of $1000, they should receive 20% of $10,000.) Donations of less than $100 are included in the total donation pool but do not entitle the employees to a reward. Additionally, add $100 to each employee in the department with the highest total donations per person.
```
GET /donations/reward
```
