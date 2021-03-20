const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql');


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
    
    const query = 'SELECT emp_id, first_name, last_name, role_id, manager_id FROM employee WHERE ?';
    connection.query(query, (err, res) => {
        if (err) throw err;
        res.forEach(({
            emp_id, first_name, last_name, role_id, manager_id
        }) => {
            console.log(
                `ID: ${emp_id} || First Name: ${first_name} || Last Name: ${last_name}`
            );
        });
        menu();
    });
};


// module.exports = menu();