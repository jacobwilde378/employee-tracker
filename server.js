const inquirer = require('inquirer');
const mysql = require('mysql2');

var roleArray = [];
var deptArray = [];
var empArray = [];

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Cooper378!',
    database: 'employee_tracker_db'
})

const returnRoleArray = new Promise((resolve, reject) => {
    var sql = `SELECT id, title FROM role`
    var err = false;
    const query = connection.query(sql, function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            roleArray.push({name: results[i].title,value: results[i].id})
        }
    })
    if (!err) {
        resolve(roleArray);
    } else {
        reject("Error")
    }
})

const returnDepartmentArray = new Promise((resolve, reject) => {
    var sql = `SELECT id, name FROM department`
    var err = false;
    const query = connection.query(sql, function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            deptArray.push({name: results[i].name,value: results[i].id})
        }
    })
    if (!err) {
        resolve(deptArray);
    } else {
        reject("Error")
    }
})

const returnEmployeeArray = new Promise((resolve, reject) => {
    var sql = `SELECT id, first_name, last_name FROM employee`
    var err = false;
    const query = connection.query(sql, function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            empArray.push({name: (results[i].id + '  ' + results[i].first_name + ' ' + results[i].last_name),value: results[i].id})
            // empArray.push({name: results[i].id,value: results[i].id})
        }
    })
    if (!err) {
        resolve(empArray);
    } else {
        reject("Error")
    }
})

function addEmployeeDB(inqResults) {
    let params = [inqResults.empAddFirstName,inqResults.empAddLastName,inqResults.empAddRole,inqResults.empAddDepartment]
    let sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) values (?, ?, ?, ?)`
    const query = connection.query(sql, params, (err, results) => {
        if(err) throw err;
        console.log("Added new user!");
        employeeMenu();
    }

    )
} 

function updateEmployeeDb(inqResults) {
    // console.log(inqResults)
}

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
    Promise.all([returnRoleArray, returnDepartmentArray])
        .then(values => {
            return inquirer.prompt([
                {
                    type: 'input',
                    message: 'Please enter a first name:  ',
                    name: 'empAddFirstName'
                },
                {
                    type: 'input',
                    message: 'Please enter a last name:  ',
                    name: 'empAddLastName'
                },
                {
                    type: 'list',
                    message: 'Please enter a first name:  ',
                    name: 'empAddRole',
                    choices: values[0]
                },
                {
                    type: 'list',
                    message: 'Please enter a first name:  ',
                    name: 'empAddDepartment',
                    choices: values[1]
                },

            ]);
            
        })
        .then(inqResults => {
            addEmployeeDB(inqResults);
        })
        .catch(e => console.log(e))
}
const updateEmployee = () => {
    Promise.all([returnEmployeeArray])
        .then(values => {
            console.log(values)
            return inquirer.prompt([
                {
                    type: 'list',
                    message: 'Please select an employee to Update:  ',
                    name: 'empUpdateSelected',
                    choices: values[0]
                },
            ]);
        })
        .then(inqResults => {
            updateEmployeeDb(inqResults);
        })
        .catch(e => console.log(e))
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
                            updateEmployee();
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
