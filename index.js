const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql');
const figlet = require("figlet");
const chalk = require("chalk");
const cTable = require('console.table');
// const { connect } = require('node:http2');
// const menu = require('./utils/control.js')

const connection = mysql.createConnection({
    host: 'localhost',
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: 'root',
    // Be sure to update with your own MySQL password!
    password: 'Philly!11',
    database: 'employee_DB',
});

connection.connect((err) => {

        if (err) throw err;
        console.log(
            chalk.red(
                figlet.textSync(`Employee Tracker`, {
                    font: 'speed',
                    horizontalLayout: "default",
                    verticalLayout: "default",
                    width: 500,
                    whitespaceBreak: true
                })
            ));
        console.log(
            chalk.red(
                figlet.textSync(`                    node.js`, {
                    font: 'small',
                    horizontalLayout: "default",
                    verticalLayout: "default",
                    width: 100,
                    whitespaceBreak: true
                })
            ));
        menu();
        return;

    },
    console.log("Yes")



);

const menu = () => {
    inquirer
        .prompt({

            type: 'list', //change to list 
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                "View All Employees",
                "View All Employees by Department",
                "View All Employees by Manager",
                "Add Employee",
                "Remove Employee",
                "Update Employee Role",
                "Update Employee Manager",
                "Update Employee",
                "Exit",
            ],
        })
        .then((answer) => {
            switch (answer.choice) {
                case 'View All Employees':
                    viewAll();
                    break;

                case 'View All Employees by Department':
                    viewDept();
                    break;

                case 'View All Employees by Manager':
                    viewManager();
                    break;

                case 'Add Employee':
                    addEmployee();
                    break;

                case 'Remove Employee':
                    removeEmployee();
                    break;

                case 'Update Employee Role':
                    updateRole();
                    break;

                case 'Update Employee Manager':
                    updateManager();
                    break;

                case 'Update Employee':
                    updateEmployee();
                    break;

                case 'Exit':
                    connection.end();
                    console.log('Disconnected from Database');
                    break;

                default:
                    console.log(`Invalid action: ${answer.choice}`);
                    break;
            }
        });
};


const viewAll = () => {

    const query = 'SELECT * FROM employee';

    // let query =
    //     'SELECT employee.emp_id, employee.first_name, employee.last_name, role.title, department.department, role.salary ';
    // query +=
    //     'FROM employee INNER JOIN role ON (employee.role_id = role.role_id) '
    // query +=
    //     'INNER JOIN department ON (role.dept_id = department.dept_id)'
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        menu();
    });
};
1

const viewDept = () => {
    let query =
        'SELECT department.department, employee.first_name, employee.last_name, role.title, role.salary ';
    query +=
        'FROM employee INNER JOIN role ON (employee.role_id = role.role_id) '
    query +=
        'INNER JOIN department ON (role.dept_id = department.dept_id) ORDER BY department.department'
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        menu();
    });
};

const viewManager = () => {
    let query =
        'SELECT CONCAT(b.last_name, " ", b.first_name) AS Manager, CONCAT(a.last_name, " ", a.first_name) AS "Direct Report" ';
    query +=
        'FROM employee a INNER JOIN employee b ON (b.emp_id = a.manager_id) '
    query +=
        'ORDER BY Manager'
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        menu();
    });
};

// const departmentChoice = () => {
//     let query = 'SELECT department FROM department;'
//     deptArray = [];
//     connection.query(query, (err, results) => {
//         if (err) throw err;
//         results.forEach(({
//             department
//         }) => {
//             deptArray.push(department);
//         });
//     })
//     return deptArray;
// };


const roleChoice = () => {
    let query = 'SELECT title FROM role;'
    roleArray = [];
    connection.query(query, (err, results) => {
        if (err) throw err;
        results.forEach(({
            title
        }) => {
            roleArray.push(title);
        });
    })
    return roleArray;
};

const managerChoice = () => {
    let query = 'SELECT last_name AS manager FROM employee ;'
    managerArray = [];
    connection.query(query, (err, results) => {
        if (err) throw err;
        results.forEach(({
            manager
        }) => {
            managerArray.push(manager);
        });
    })
    return managerArray;
};

const addEmployee = () => {
    // let query = "SELECT DISTINCT department.department, role.title FROM role INNER JOIN department ON (role.dept_id = department.dept_id)"
    // connection.query(query, (err, results) => {
    //     if (err) throw err;
    const promptUser = () => {
        inquirer.prompt([{
                    type: 'input',
                    name: 'first_name',
                    message: 'What is the new employees first name?',
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: 'What is the new employees last name?',
                },
                // {
                //     name: 'department',
                //     type: 'rawlist',
                //     choices: departmentChoice(),
                //     message: 'What department does the employee belong to?',
                // },
                {
                    name: 'title',
                    type: 'rawlist',
                    choices: roleChoice(),
                    message: 'What is the new employees title?',
                },
                {
                    name: 'manager',
                    type: 'rawlist',
                    choices: managerChoice(),
                    message: 'Who is the new employees manager?',
                },

            ])
            //     .then((answers) => {
            //         console.log(answers.title)
            //         console.log(answers.manager)
            //         menu();
            // })



            .then((answers) => {
                connection.query(
                        'INSERT INTO employee SET ?', {
                            first_name: answers.first_name,
                            last_name: answers.last_name,
                        },
                    (err) => {
                        if (err) throw err;
                        console.log('Employee created');
                    });
                menu();

            })

    };
    
    promptUser();
}
//     );

// }

// {
//     name: 'choice',
//     type: 'manager',
//     choices() {





//         let query1 = 'SELECT DISTINCT CONCAT(b.last_name, " ", b.first_name) AS Manager, ';
//         query1 +=
//             'FROM employee a INNER JOIN employee b ON (b.emp_id = a.manager_id) '
//         query1 +=
//             'ORDER BY Manager'
//         const choiceArray = [];

//         connection.query(query1, (err, res) => {
//             if (err) throw err;
//             choiceArray.push(res);
//             console.table(res);
//             return choiceArray;
//         })
//     },
//     message: 'What is the new employees title?',
// },

// {
//     type: 'input',
//     name: 'bid',
//     message: 'What is the new employees last name?',
// },
// {
//     type: 'input',
//     name: 'bid',
//     message: 'What is the new employees last name?',
// },







// const init = async () => {
//     try {
//         await 
//     } catch (error) {
//         console.log(error)
//     }




// };

// init();

// init();
// promptUser().then((answers) => {
//     const readMe = generateReadMe(answers);
//     fs.writeFile('README.md', readMe, (err) => {
//         if (err) {
//             console.error(err)
//             return
//         }
//         console.log('Successfully wrote to README.md')
//     });

// figlet.fonts(function (err, fonts) {
//     if (err) {
//         console.log('something went wrong...');
//         console.dir(err);
//         return;
//     }
//     console.dir(fonts);
// });
// openQuestions();


// Function call to initialize app