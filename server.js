const inquirer = require('inquirer');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Cooper378!',
    database: 'employee_tracker_db'
})

const primaryMenuQuestion = [
    {
        type: 'list',
        name: 'primaryMenu',
        message: "Please select from one of the following:  ",
        choices: [
            { name: 'Maintain Employees' },
            { name: 'Maintain Roles' },
            { name: 'Maintain Departments' },
            { name: 'Exit Program' },
        ]
    }
];

const employeeMenuQuestion = [
    {
        type: 'list',
        name: 'employeeMenuSelection',
        message: 'Please choose an action:  ',
        choices: [
            { name: 'Add a New Employee' },
            { name: 'Update an Existing Employee' },
            { name: "Remove an Employee" },
            { name: "Return to Main Menu" },

        ]
    }
];

const addEmployeeQuestion = [
    {
        type: 'input',
        name:  'addEmployeeFirstName',
        message: "Please enter the employee's first name:  "
    },
    {
        type: 'input',
        name:  'addEmployeeLastName',
        message: "Please enter the employee's last name:  "
    },
    {
        type: 'input',
        name:  'addEmployeeRoleId',
        message: "Please select the employee's role:  ",
        choices: []
    },
    {
        type: 'input',
        name:  'addEmployeeManagerId',
        message: "Please select the employee's manager:  "
    }
]

const roleMenuQuestion = [
    {
        type: 'list',
        name: 'roleMenuSelection',
        message: 'Please choose an action:  ',
        choices: [
            { name: 'Add a New Role' },
            { name: 'Update an Existing Role' },
            { name: "Remove an Role" },
            { name: "Return to Main Menu" },

        ]
    }
];

const departmentMenuQuestion = [
    {
        type: 'list',
        name: 'departmentMenuSelection',
        message: 'Please choose an action:  ',
        choices: [
            { name: 'Add a New Department' },
            { name: 'Update an Existing Department' },
            { name: "Remove an Department" },
            { name: "Return to Main Menu" },

        ]
    }
];


const employeeMenu = () => {
    return inquirer.prompt(employeeMenuQuestion)
}

const addEmployee = () => {
    return inquirer.prompt(addEmployeeQuestion)
}

const roleMenu = () => {
    return inquirer.prompt(roleMenuQuestion)

}

const departmentMenu = () => {
    return inquirer.prompt(departmentMenuQuestion)
}

const init = () => {
    return inquirer.prompt(primaryMenuQuestion)
}



init()
    .then(results => {
        if (results.primaryMenu === "Maintain Employees") {
            employeeMenu()
                .then(data => {
                    connection.connect(err => {
                        if (err) throw err;

                        if (data.employeeMenuSelection === "Add a New Employee") {
                            addEmployee()
                                .then(addEmpResults => {
                                    console.log(addEmpResults)
                                })
                        }
                        if (data.employeeMenuSelection === "Update an Existing Employee") {
                            queryAllEmployees()
                                .then(empArray => {

                                })
                        }
                        if (data.employeeMenuSelection === "Remove an Employee") {

                        }
                    });
                })
        }
        if (results.primaryMenu === "Maintain Roles") {
            roleMenu();
        }
        if (results.primaryMenu === "Maintain Departments") {
            departmentMenu();
        } else {
            console.log("under development!!!")
        }
        return
    });



queryAllEmployees = () => {
    connection.query(
        `SELECT first_name, last_name FROM employee`, (err, results, fields) => {
            console.log(results)
        }
    )
    connection.end();
}