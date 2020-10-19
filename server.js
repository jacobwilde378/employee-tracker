const inquirer = require('inquirer');
const mysql = require('mysql2');

var roleArray = [];
var deptArray = []

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Cooper378!',
    database: 'employee_tracker_db'
})

const returnRoleArray = new Promise((resolve, reject) => {
    var sql = `SELECT title FROM role`
    var err = false;
    const query = connection.query(sql, function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            roleArray.push(results[i].title)
        }
    })
    if (!err) {
        resolve(roleArray);
    }else {
        reject("Error")
    }
})

const returnDepartmentArray = new Promise((resolve, reject) => {
    console.log("second function")
    var sql = `SELECT name FROM department`
    const query = connection.query(sql, function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            deptArray.push(results[i].name)
        }
        resolve();
    })
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


const updateEmployeeQuestion = [
    {
        type: 'list',
        name: 'updateEmployeeSelection',
        message: 'Please select the employee to alter:  '
    }
]

const removeEmployeeQuestion = [
    {
        type: 'list',
        name: 'removeEmployeeSelection',
        message: 'Please select the employee to remove:  '
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

function addEmployee() {
    Promise.all(returnRoleArray)
        .then(values => console.log(values))
        .catch(console.log("error!!!!"))
}
const updateEmployee = () => {
    return inquirer.prompt(updateEmployeeQuestion)
}

const removeEmployee = () => {
    return inquirer.prompt(removeEmployeeQuestion)
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
                            addEmployee();
                        }
                        if (data.employeeMenuSelection === "Update an Existing Employee") {
                            queryAllEmployees()
                                .then(roleArray => {


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
    connection.connect(err => {
        if (err) throw err;
        connection.query(
            `SELECT id, first_name, last_name FROM employee`, (err, results, fields) => {
                console.log(results)
            }
        )
        connection.end();
    });
}


queryAllDepartments = () => {
    connection.connect(err => {
        if (err) throw err;
        connection.query(
            `SELECT name FROM department`, (err, results, fields) => {
                console.log(results)
            }
        )
        connection.end();
    });
}

