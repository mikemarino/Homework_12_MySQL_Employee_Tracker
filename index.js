const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql');
const figlet = require("figlet");
const chalk = require("chalk");
const cTable = require('console.table');
// const { rawListeners } = require('../upenn-phi-fsf-pt-12-2020-u-c/12-MySQL/02-Homework/Main/db/connection');

// const { map } = require('bluebird');
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

    // const query = 'SELECT * FROM employee';

    let query =
        'SELECT employee.emp_id, employee.first_name, employee.last_name, role.title, department.department, role.salary ';
    query +=
        'FROM employee INNER JOIN role ON (employee.role_id = role.role_id) '
    query +=
        'INNER JOIN department ON (role.dept_id = department.dept_id)'
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        menu();
    });
};
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


const roleChoice = () => {
    let query = 'SELECT * FROM role;'
    let roleArray = [];
    connection.query(query, (err, rolesQ) => {
        if (err) throw err;
        rolesQ.map(function (roles) {
            roleArray.push(roles.title);
            // return roles.title
        });
    })
    // console.log(roleArray);
    return roleArray;
};



function roleID(value, callback) {
    let queryRole = 'SELECT role_id FROM role WHERE role.title = ?'
    let getID = [];
    connection.query(queryRole, [value], (err, res) => {
        if (err) throw err;
        getID = res.map((role) => {
            return role.role_id;
        })
        callback(getID);
    })
}

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

function managerID(value, callback) {
    let queryManager = 'SELECT emp_id FROM employee WHERE employee.last_name = ?'
    let getID = [];
    connection.query(queryManager, [value], (err, res) => {
        if (err) throw err;
        getID = res.map((manager) => {
            return manager.emp_id;
        })
        callback(getID);
    })
}

function createEmployee(a, b, c, d) {
    connection.query(
        'INSERT INTO employee SET ?', {
            first_name: a,
            last_name: b,
            role_id: c,
            manager_id: d
        },
        (err) => {
            if (err) throw err;
            console.log('Employee created');
        });
    console.log("Employee Added!")
    menu();

}

function deleteEmployee(value) {
    let deleteQ = 'DELETE FROM employee WHERE last_name = ?'
    connection.query(deleteQ, [value], (err, res) => {
        if (err) throw err;

    })
    console.log("Employee Removed")
    menu();
}

const removeEmployee = () => {
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        inquirer.prompt([{
                type: 'rawlist',
                message: 'What employee do you want to remove?',
                name: 'removed',
                choices: res.map(res => res.last_name)
            }])
            .then((answers) => {
                deleteEmployee(answers.removed);
            });
    })
};


const updateRole = () => {
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        inquirer.prompt([{
                type: 'rawlist',
                message: 'What employee do you want to update?',
                name: 'empName',
                choices: res.map(res => res.last_name)
            }])
            .then((answers) => {
                let chosenEmp;
                res.forEach((item) => {
                    if (item.last_name === answers.empName) {
                        chosenEmp = item;
                    }
                })
                connection.query('SELECT * FROM role', (err, res) => {
                    if (err) throw err;
                    inquirer.prompt([{
                            type: 'rawlist',
                            message: 'What is the new Role?',
                            name: 'newRole',
                            choices: res.map(res => res.title)
                        }])
                        .then((answers) => {
                            let chosenRole;
                            res.forEach((item) => {
                                if (item.title === answers.newRole) {
                                    chosenRole = item;
                                }

                            })
                            connection.query(
                                'UPDATE employee SET ? WHERE ?',
                                [{
                                        role_id: chosenRole.role_id,
                                    },
                                    {
                                        first_name: chosenEmp.first_name,
                                    },
                                ],
                                (err) => {
                                    if (err) throw err;
                                    console.log('Employee updated');
                                    menu();
                                });
                        })
                })
            });
    })
};

const addEmployee = () => {
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
            .then((answers) => {
                // call back functions here. roleID function takes the title into the function, 
                // where it finds the ID,
                // then it returns a callback where it passes the ID to a function (a)
                // the value for (a) can only exist within the roleID function 
                // this requires that you nest additional functions if they need to use (a)
                roleID(answers.title, (a) => {
                    managerID(answers.manager, (b) => {
                        createEmployee(answers.first_name, answers.last_name, a, b)

                    })
                })
            })
    };
    promptUser();
};

const updateManager = () => {
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        inquirer.prompt([{
                type: 'rawlist',
                message: 'What employee do you want to update?',
                name: 'empName',
                choices: res.map(res => res.last_name)
            }, {
                type: 'rawlist',
                message: 'Who is the new Manager?',
                name: 'mgrName',
                choices: res.map(res => res.last_name)
            }])
            .then((answers) => {
                let chosenEmp;
                let chosenMgr;
                res.forEach((item) => {
                    if (item.last_name === answers.empName) {
                        chosenEmp = item;
                    }
                })
                res.forEach((item) => {
                    if (item.last_name === answers.mgrName) {
                        chosenMgr = item;
                    }
                })
                connection.query(
                    'UPDATE employee SET ? WHERE ?',
                    [{
                            manager_id: chosenMgr.emp_id,
                        },
                        {
                            last_name: chosenEmp.last_name,
                        },
                    ],
                    (err) => {
                        if (err) throw err;
                        console.log('Employee updated');
                        menu();
                    });
            })
    });
}


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



// inquirer.prompt([{
//         type: 'rawlist',
//         message: 'Who is the new Manager?',
//         name: 'mgrName',
//         choices: res.map(res => res.last_name)
//     }])
//     .then((answers) => {
//         let chosenMgr;
//         res.forEach((item) => {
//             if (item.last_name === answers.mgrName) {
//                 chosenMgr = item;
//             }

//         })
//         connection.query(
//             'UPDATE employee SET ? WHERE ?',
//             [{
//                     manager_id: chosenMgr.emp_id,
//                 },
//                 {
//                     first_name: chosenEmp.last_name,
//                 },
//             ],
//             (err) => {
//                 if (err) throw err;
//                 console.log('Employee updated');
//                 menu();
//             });
// //     })
// })
// });


// function updateEmployeeRole(value1, value2) {
//     let updateRole = 'UPDATE employee SET '
//     connection.query(deleteQ, [value1, value2], (err, res) => {
//         if (err) throw err;

//     })
//     console.log("Employee Removed")
//     menu();
// }



// console.log(answers)
// query = 'DELETE FROM employee WHERE last_name = ?'
// connection.query(query, {
//         last_name: answers.removed,
//     },
//     (err) => {
//         if (err) throw err;
//     })
// console.log('Employee deleted');
// menu();

// // let newRole = answers.newRole;
// let getID = [];
// let queryRole = 'SELECT role_id FROM role WHERE role.title = ?'    
// connection.query(queryRole, answers.newRole, (err, res) => {
//     if (err) throw err;
//     res.push(getID);
//     // getID = res.map(res => res.role_id)
//     // //     {
//     console.log(getID)


//     // })

// })
// // console.log(getID);


// }).then((getID) => {
//     // console.log(getID())
//     console.log('YPPPPPOOOOOOOO');
//     connection.query(
//         'UPDATE employee SET ? WHERE ?', {
//             role_id: getID,
//         }, {
//             first_name: empName
//         },
//         (err) => {
//             if (err) throw err;
//             console.log('Employee updated');
//             menu();
//         });
//     // console.log("Employee Updated")

// })


// const employeeChoice = () => {
//     let query = 'SELECT * FROM employee;'
//     let empArray = [];
//     connection.query(query, (err, empQ) => {
//         if (err) throw err;
//         empQ.map(function (employee) {
//             empArray.push(employee.last_name);
//             // console.log(empArray)
//         });
//     })
//     return empArray;
// };

// function deleteEmployee(ff) {
//     connection.query(
//         'DELETE FROM employee WHERE last_name = ?', {
//             last_name: ff
//         },
//         (err) => {
//             if (err) throw err;
//         });
//     console.log("Employee Removed!")
//     menu();
// };
// const removeEmployee = async () => {

//     // var choiceArr = await employeeChoice()

//     const promptUser = () => {
//         // const employeeChoice = () => {
//         //     let query = 'SELECT * FROM employee;'
//         //     let empArray = [];
//         //     connection.query(query, (err, empQ) => {
//         //         if (err) throw err;
//         //         empQ.map(function (employee) {
//         //             empArray.push(employee.last_name);
//         //             // console.log(empArray)
//         //         });
//         //     })
//         //     return empArray;
//         // };
//         // return empArray;
//         // WHAT THE HELL IS UP WITH THIS PART?  WHY CAN'T I RUN THE LIST PROMPT FIRST?
//         inquirer.prompt([
//                 {
//                     type: 'input',
//                     name: 'first_name',
//                     message: 'What is the new employees first name?',
//                 },
//                 {
//                     type: 'rawlist',
//                     name: 'removeEmployee',
//                     choices: employeeChoice(),
//                     message: 'What employee do you want to remove from the system?',
//                 }
//             ])
//             .then((answers) => {
//                 // console.log(answers);
//                 connection.query(
//                     'DELETE FROM employee WHERE ?', {
//                         last_name: answers.removeEmployee,
//                     },
//                     (err) => {
//                         if (err) throw err;
//                     })
//                 console.log('Employee deleted');
//                 menu();
//             })
//     };


//     promptUser();
// };





// {

// type: 'list',
// message: 'What employee do you want to remove?',
// name: 'removed',
// choices: res.map(res => res.emp_id + " " + res.first_name + " " + res.last_name)
// }


// const employeeChoice = () => {
//     let query = 'SELECT * FROM employee;'
//     let empArray = [];
//     connection.query(query, (err, emp_Q) => {
//         if (err) throw err;
//         emp_Q.map(function (employees) {
//             empArray.push(employees.first_name);
//             // console.log(employees.first_name);
//         });
//     })
//     // console.log(empArray)
//     return empArray;
// };

// const employeeChoice = () => {
//     let query = 'SELECT * FROM employee AS empName;'
//     let empArray = [];
//     connection.query(query, (err, results) => {
//                 if (err) throw err;
//                 results.forEach(({
//                     empName
//                 }) => {
//                     empArray.push(empName);
//                     console.log(empName)
//                 });
//     })
//     // console.log(empArray)
//     return empArray;
// };

// const managerChoice = () => {
//     let query = 'SELECT last_name AS manager FROM employee ;'
//     managerArray = [];
//     connection.query(query, (err, results) => {
//         if (err) throw err;
//         results.forEach(({
//             manager
//         }) => {
//             managerArray.push(manager);
//         });
//     })
//     return managerArray;
// };


// let query = 'SELECT emp_id, first_name, " ", last_name FROM employee ;'
// employeeArray = [];
// connection.query(query, (err, results) => {
//     if (err) throw err;
//     results.forEach(({
//         manager
//     }) => {
//         managerArray.push(manager);
//     });
// })
// return managerArray;


// let test = roleID(answers.title)





// console.log(test)

// roleID = '';
// // var managerID = "";
// const queryRole =
//     'SELECT role_id FROM role WHERE role.title = ?'
// connection.query(queryRole, [answers.title], (err, res) => {
//     if (err) throw err;
//     // setRole(res)


//     roleID.push(res)
// });

// function setRole(value) {
//     roleID = value;
//     return roleID;
// }



// console.log(roleID)


// const setRole = (value) => { roleID = value}
// console.log(roleID)

// const queryManager =
//     'SELECT emp_id FROM employee WHERE last_name = ?'
// connection.query(queryManager, [answers.manager], (err, res) => {
//     if (err) throw err;
//     managerID = res;

//     // return managerID;
// }) console.log(managerID)

// connection.query(
//     'INSERT INTO employee SET ?', {
//         first_name: answers.first_name,
//         last_name: answers.last_name,
//     },
//     (err) => {
//         if (err) throw err;
//         console.log('Employee created');
//     });

// menu();

// console.log(roleID);
// })
// .then((answers) => {
//     connection.query(
//         'INSERT INTO employee SET ?', {
//             first_name: answers.first_name,
//             last_name: answers.last_name,
//         },
//         (err) => {
//             if (err) throw err;
//             console.log('Employee created');
//         });
//     menu();
// });







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


// Function call to initializeapp