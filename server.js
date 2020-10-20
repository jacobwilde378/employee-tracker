let { restoreDefaultPrompts } = require('inquirer');
let inquirer = require('inquirer');
let mysql = require('mysql2');
let cTable = require('console.table');

var roleArray = [];
var deptArray = [];
var empArray = [];

let connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Cooper378!',
    database: 'employee_tracker_db'
})

// SQL Calls to return Arrays

let returnEmployeeArray = new Promise((resolve, reject) => {
    var sql = `SELECT id, first_name, last_name FROM employee`
    var err = false;
    let query = connection.query(sql, function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            empArray.push({ name: (results[i].id + '  ' + results[i].first_name + ' ' + results[i].last_name), value: results[i].id })
            // empArray.push({name: results[i].id,value: results[i].id})
        }
    })
    if (!err) {
        resolve(empArray);
    } else {
        reject("Error")
    }
})

let returnRoleArray = new Promise((resolve, reject) => {
    var sql = `SELECT id, title FROM role`
    var err = false;
    let query = connection.query(sql, function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            roleArray.push({ name: results[i].title, value: results[i].id })
        }
    })
    if (!err) {
        resolve(roleArray);
    } else {
        reject("Error")
    }
})

let returnDepartmentArray = new Promise((resolve, reject) => {
    var sql = `SELECT id, name FROM department`
    var err = false;
    let query = connection.query(sql, function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            deptArray.push({ name: results[i].name, value: results[i].id })
        }
    })
    if (!err) {
        resolve(deptArray);
    } else {
        reject("Error")
    }
})

let returnEmpDetails = function (empId) {
    return new Promise((resolve, reject) => {
        var sql = `select * from employee where id = ${empId}`
        var err = false;
        let query = connection.query(sql, function (err, results) {
            if (err) throw err;
            if (!err) {
                resolve(results);
            } else {
                reject("Error")
            }
        })
    })
}

let returnRoleDetails = function (empId) {
    return new Promise((resolve, reject) => {
        var sql = `select * from role where id = ${empId}`
        var err = false
        let query = connection.query(sql, function (err, results) {
            if (err) throw err;
            if (!err) {
                resolve(results);
            } else {
                reject("Error")
            }
        })
    })
}

let returnDepartmentDetails = function (empId) {
    return new Promise((resolve, reject) => {
        var sql = `select * from department where id = ${empId}`
        var err = false
        let query = connection.query(sql, function (err, results) {
            if (err) throw err;
            if (!err) {
                resolve(results);
            } else {
                reject("Error")
            }
        })
    })
}

// Employee Menu

let employeeMenuQuestion = [
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

function addEmployeeDB(inqResults) {
    let params = [inqResults.empAddFirstName, inqResults.empAddLastName, inqResults.empAddRole, inqResults.empAddManager]
    let sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) values (?, ?, ?, ?)`
    let query = connection.query(sql, params, (err, results) => {
        if (err) throw err;
        console.log("Added new user!");
        init();
    }

    )
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
                    message: 'Please select a role:  ',
                    name: 'empAddRole',
                    choices: values[0]
                },
                {
                    type: 'checkbox',
                    message: 'Please select a Manager:  ',
                    name: 'empAddManager',
                    choices: values[1]
                },

            ]);

        })
        .then(inqResults => {
            addEmployeeDB(inqResults);
        })
        .catch(e => console.log(e))
}

function updateEmployeeDb(empId, empDetails) {
    let sql = `UPDATE employee SET 
    first_name = '${empDetails.empUpdateFirstName}',
    last_name = '${empDetails.empUpdateLastName}',
    role_id = '${empDetails.empUpdateRole}',
    manager_id = '${empDetails.empUpdateManager}'
    WHERE id = '${empId.empUpdateSelection}'`
    let query = connection.query(sql, (err, results) => {
        if (err) throw err;
        console.log("User Updated!");
        init();
    }
    )
}

let updateEmployee = () => {
    Promise.all([returnEmployeeArray, returnRoleArray])
        .then(values => {
            return inquirer.prompt([
                {
                    type: 'list',
                    message: 'Please select a user to update:  ',
                    name: 'empUpdateSelection',
                    choices: values[0]
                },
            ]);
        })
        .then(empId => {
            returnEmpDetails(empId.empUpdateSelection)
                .then(empDetails => {
                    Promise.all([returnRoleArray, returnEmployeeArray])
                        .then(menuContents => {
                            return inquirer.prompt([
                                {
                                    type: 'input',
                                    message: 'Please enter the new First Name:  ',
                                    name: 'empUpdateFirstName',
                                    default: empDetails[0].first_name
                                },
                                {
                                    type: 'input',
                                    message: 'Please enter the new Last Name:  ',
                                    name: 'empUpdateLastName',
                                    default: empDetails[0].last_name
                                },
                                {
                                    type: 'list',
                                    message: 'Please select a new role:  ',
                                    name: 'empUpdateRole',
                                    default: empDetails[0].role_id,
                                    choices: menuContents[0]

                                },
                                {
                                    type: 'list',
                                    message: 'Please select a new Manager:  ',
                                    name: 'empUpdateManager',
                                    default: empDetails[0].manager_id,
                                    choices: menuContents[1]
                                },
                            ])
                        })
                        .then(updateEmpDetails => {
                            updateEmployeeDb(empId, updateEmpDetails);
                        })
                }
                )
        })
        .catch(e => console.log(e))
}

function removeEmployeeDb(empDetails) {
    let sql = `DELETE FROM employee WHERE id = '${empDetails}'`
    let query = connection.query(sql, (err, results) => {
        if (err) throw err;
        console.log("User removed!");
        init();
    })
}

let removeEmployee = () => {
    Promise.all([returnEmployeeArray, returnRoleArray])
        .then(values => {
            return inquirer.prompt([
                {
                    type: 'checkbox',
                    message: 'Please select a user to remove:  ',
                    name: 'empRemoveSelection',
                    choices: values[0]
                },
            ]);
        })
        .then(empId => {
            removeEmployeeDb(empId.empRemoveSelection);
        })
        .catch(e => console.log(e))
}

let employeeMenu = () => {
    return inquirer.prompt(employeeMenuQuestion)
}

//Role Menu

let roleMenuQuestion = [
    {
        type: 'list',
        name: 'roleMenuSelection',
        message: 'Please choose an action:  ',
        choices: [
            { name: 'Add a New Role' },
            { name: 'Update an Existing Role' },
            { name: "Remove a Role" },
            { name: "Return to Main Menu" },

        ]
    }
];

function addRoleDB(data) {
    let params = [data.roleAddTitle, data.roleAddSalary, data.roleAddDepartment]
    let sql = `INSERT INTO role (title, salary, department_id) values (?, ?, ?)`
    let query = connection.query(sql, params, (err, results) => {
        if (err) throw err;
        console.log("Added new role!");
        init();
    }

    )
}

function addRole() {
    Promise.all([returnDepartmentArray])
        .then(depts => {
            return inquirer.prompt([
                {
                    type: 'input',
                    message: 'Please enter the new role title:  ',
                    name: 'roleAddTitle'
                },
                {
                    type: 'input',
                    message: 'Please enter the salary:  ',
                    name: 'roleAddSalary'
                },
                {
                    type: 'list',
                    message: 'Please select the department:  ',
                    name: 'roleAddDepartment',
                    choices: depts[0]
                },
            ])
        })
        .then(inqResults => {
            addRoleDB(inqResults);
        })
}

function updateRoleDB(roleId, data) {
    console.log(roleId)
    let sql = `UPDATE role SET 
    title = '${data.roleUpdateTitle}',
    salary = '${data.roleUpdateSalary}',
    department_id = '${data.roleUpdateDepartment}'
    WHERE id = '${roleId.roleUpdateSequence}'`
    console.log(sql)
    let query = connection.query(sql, (err, results) => {
        if (err) throw err;
        console.log("Role Updated!");
        init();
    }
    )
}

function updateRole() {
    Promise.all([returnRoleArray])
        .then(roles => {
            return inquirer.prompt([
                {
                    type: 'list',
                    message: 'Please select a role to update:  ',
                    name: 'roleUpdateSequence',
                    choices: roles[0]
                }
            ])
        })
        .then(roleId => {
            returnRoleDetails(roleId.roleUpdateSequence)
                .then(roleDetail => {
                    Promise.all([returnDepartmentArray])
                        .then(depts => {
                            return inquirer.prompt([
                                {
                                    type: 'input',
                                    name: 'roleUpdateTitle',
                                    message: 'Please enter a title:  ',
                                    default: roleDetail[0].title
                                },
                                {
                                    type: 'input',
                                    name: 'roleUpdateSalary',
                                    message: 'Please enter a salary:  ',
                                    default: roleDetail[0].salary
                                },
                                {
                                    type: 'list',
                                    name: 'roleUpdateDepartment',
                                    message: 'Please select a department:  ',
                                    default: roleDetail[0].department_id,
                                    choices: depts[0]
                                }
                            ])
                        })
                        .then(roleDetail => {
                            updateRoleDB(roleId, roleDetail);
                        })
                })

        })
}

function removeRoleDB(roleId) {
    let sql = `DELETE FROM role WHERE id = '${roleId}'`
    let query = connection.query(sql, (err, results) => {
        if (err) throw err;
        console.log("Role removed!");
        init();
    })
}

function removeRole() {
    Promise.all([returnRoleArray])
        .then(roles => {
            return inquirer.prompt([
                {
                    type: 'list',
                    message: 'Please select a role to remove:  ',
                    name: 'roleRemoveSequence',
                    choices: roles[0]
                }
            ])
        })
        .then(data => {
            removeRoleDB(data.roleRemoveSequence)
        })
}

let roleMenu = () => {
    return inquirer.prompt(roleMenuQuestion)

}


//Department Menu

let departmentMenuQuestion = [
    {
        type: 'list',
        name: 'departmentMenuSelection',
        message: 'Please choose an action:  ',
        choices: [
            { name: 'Add a New Department' },
            { name: 'Update an Existing Department' },
            { name: "Remove a Department" },
            { name: "Return to Main Menu" },

        ]
    }
];

function addDepartmentDB(data) {
    let params = [data]
    let sql = `INSERT INTO department (name) values (?)`
    let query = connection.query(sql, params, (err, results) => {
        if (err) throw err;
        console.log("Added new department!");
        init();
    }

    )
}

function addDepartment() {
    Promise.all([returnDepartmentArray])
        .then(depts => {
            return inquirer.prompt([
                {
                    type: 'input',
                    message: 'Please enter the department name:  ',
                    name: 'departmentAddName'
                }
            ]);
        })
        .then(deptName => {
            addDepartmentDB(deptName.departmentAddName);
        })
}

function updateDepartmentDB(dep_id, data) {
    let sql = `UPDATE department SET 
    name = '${data.departmentUpdateName}'
    WHERE id = '${dep_id}'`
    console.log(sql)
    let query = connection.query(sql, (err, results) => {
        if (err) throw err;
        console.log("Department Updated!");
        init();
    }
    )

}

function updateDepartment() {
    Promise.all([returnDepartmentArray])
        .then(depts => {
            return inquirer.prompt([
                {
                    type: 'list',
                    name: 'departmentUpdateSequence',
                    choices: depts[0]
                }
            ])
        })
        .then(deptSeq => {
            returnDepartmentDetails(deptSeq.departmentUpdateSequence)
                .then(data => {
                    return inquirer.prompt([
                        {
                            type: 'input',
                            name: 'departmentUpdateName',
                            default: data.name,
                            message: 'Please enter a new department name:'
                        }
                    ])
                })
                .then(dept => {
                    updateDepartmentDB(deptSeq.departmentUpdateSequence, dept)
                })
        })
}

function removeDepartmentDB(dept_id) {
    let sql = `DELETE FROM department WHERE id = '${dept_id}'`
    let query = connection.query(sql, (err, results) => {
        if (err) throw err;
        console.log("Department removed!");
        init();
    })
}

function removeDepartment() {
    Promise.all([returnDepartmentArray])
        .then(depts => {
            return inquirer.prompt([
                {
                    type: 'list',
                    message: 'Please select a department to remove:  ',
                    name: 'departmentRemoveSequence',
                    choices: depts[0]
                }
            ])
        })
        .then(data => {
            removeDepartmentDB(data.departmentRemoveSequence)
        })
}

let departmentMenu = () => {
    return inquirer.prompt(departmentMenuQuestion)
}


//View Reports Menu
function viewDepartments() {
    var sql = `SELECT 
    id as 'Department ID',
     name as 'Department Name'
     FROM department`
    var err = false;
    let query = connection.query(sql, function (err, results) {
        if (err) throw err;
        let table = cTable.getTable("Department Table",results)
        console.log(table)
    })
}

function viewRoles() {
    var sql = `SELECT
     role.id as 'Role ID',
     role.title as 'Role Title',
     role.salary as 'Role Salary',
     role.department_id as 'Department ID',
     department.name as 'Department Name'
     FROM role
     INNER JOIN department ON department.id = role.department_id`
    var err = false;
    let query = connection.query(sql, function (err, results) {
        if (err) throw err;
        let table = cTable.getTable("Role Table",results)
        console.log(table)
        init();
    })
}


let generateReports = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'reportMenuSelection',
            message: 'Please choose an action:  ',
            choices: [
                { name: 'View All Departments' },
                { name: 'View All Roles' },
                { name: "View All Employees" },
                { name: "View Employees by Manager" },

            ]
        }
    ])
}

// Main Menu
let primaryMenuQuestion = [
    {
        type: 'list',
        name: 'primaryMenu',
        message: "Please select from one of the following:  ",
        choices: [
            { name: 'Maintain Employees' },
            { name: 'Maintain Roles' },
            { name: 'Maintain Departments' },
            { name: 'View Reports' },
            { name: 'Exit Program' },
        ]
    }
];

function init() {
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
                            removeEmployee();
                        }
                    });
                })
        }
        if (results.primaryMenu === "Maintain Roles") {
            roleMenu()
                .then(data => {
                    connection.connect(err => {
                        if (err) throw err;

                        if (data.roleMenuSelection === "Add a New Role") {
                            addRole();
                        }
                        if (data.roleMenuSelection === "Update an Existing Role") {
                            updateRole();
                        }
                        if (data.roleMenuSelection === "Remove a Role") {
                            removeRole();
                        }
                    });
                })
        }
        if (results.primaryMenu === "Maintain Departments") {
            departmentMenu()
                .then(data => {
                    connection.connect(err => {
                        if (err) throw err;

                        if (data.departmentMenuSelection === "Add a New Department") {
                            addDepartment();
                        }
                        if (data.departmentMenuSelection === "Update an Existing Department") {
                            updateDepartment();
                        }
                        if (data.departmentMenuSelection === "Remove a Department") {
                            removeDepartment();
                        }
                    });
                })
        }
        if (results.primaryMenu === "View Reports") {
            generateReports()
                .then(data => {
                    console.log(data)
                    connection.connect(err => {
                        if (err) throw err;

                        if (data.reportMenuSelection === "View All Departments") {
                            viewDepartments();
                        }

                        if (data.reportMenuSelection === "View All Roles") {
                            viewRoles();
                        }

                        if (data.reportMenuSelection === "View All Employees") {
                            viewEmployees();
                        }

                        if (data.ReportMenuSelection === "View Employees by Manager") {
                            viewManager();
                        }


                    })
                })
        }

        else {
            console.log("under development!!!")
        }
        return
    });
