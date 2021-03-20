/* Seeds for employee table. */
USE employee_db;

/* Insert 3 Rows into your new table */
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
("Peter", "Parker", 3, null),
("Tony", "Stark", 2, null),
("Thor", "Odinson", 1, null),
("Steve", "Rodgers", 6, null),
("Bruce", "Banner", 4, null),
("T'Challa", "Okonkwo", 9, null),
("Carol", "Danvers", 5, null),
("Natasha", "Romanoff", 11, null)

SELECT * FROM employee;

/* Seeds for department table. */
USE employee_db;

/* Insert 3 Rows into your new table */
INSERT INTO department (name)
VALUES ("Sales"), ("Engineering"), ("Legal"), ("Finance"), ("Audit"), ("Human Resources");

SELECT * FROM department;

/* Seeds for department table. */
USE employee_db;

/* Insert 3 Rows into your new table */
INSERT INTO role (title, salary, dept_id)
VALUES 
("Sales Lead", "100000", 1), 
("Salesperson", "80000", 1),
("Lead Engineer", "150000", 2), 
("Software Engineer", "120000", 2), 
("Legal Team Lead", "250000", 3), 
("Lawyer", "190000", 3),
("Lead Accountant", "120000", 4), 
("Accountant", "80000", 4), 
("Audit Director", "200000", 5), 
("Senior Auditor", "120000", 5), 
("HR Director", "180000", 6), 
("HR Administrator", "100000", 6);


SELECT * FROM role;