const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql');
const figlet = require("figlet");
const chalk = require("chalk");



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



// init();

connection.connect((err) => {
    if (err) throw err;
    console.log(
        chalk.red(
            figlet.textSync(`connected as id ${connection.threadId}`, {
                font: 'rectangles',
                horizontalLayout: "default",
                verticalLayout: "default",
                width: 100,
                whitespaceBreak: true
            })
        )
    );

    
    // figlet.fonts(function (err, fonts) {
    //     if (err) {
    //         console.log('something went wrong...');
    //         console.dir(err);
    //         return;
    //     }
    //     console.dir(fonts);
    // });
    // openQuestions();
});