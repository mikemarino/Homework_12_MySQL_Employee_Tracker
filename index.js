const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql');
const figlet = require("figlet");
const chalk = require("chalk");
const cTable = require('console.table');
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
    connection.query(query, (err, res) => {
        if (err) throw err;

        console.table(res);
        // let show = res(({
        //     emp_id,
        //     first_name,
        //     last_name,
        //     role_id,
        //     manager_id
        // }) => {
        //     console.table([{id: emp_id, name: first_name}]
        //         // `${emp_id}, ${first_name}, ${last_name}`
        //     );
        // });
        menu();
    });
};


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