const { prompt } = require('inquirer')
const mysql = require('mysql2')
require('console.table')

const db = mysql.createConnection('mysql://root:rootroot@localhost/employees_db')



const addEmployee = () => {
db.query('SELECT * FROM role', (err,roles) => {
  if (err) {console.log(err)}

   roles = roles.map (role => ({
    name: role.title,
    value: role.id
  
  }))
  db.query('SELECT * FROM employee', (err, employees) => {

    employees = employees.map(employee => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id
    }))

    employees.unshift({name: 'None', value: null })

    prompt([

    {
      type: 'input',
      name: 'first_name',
      message: 'What is the employee first name?'
    },
    {

      type: 'input',
      name: 'last_name',
      message: 'What is the employee last name?'
    },
    {

      type: 'list',
      name: 'role_id',
      message: 'Choose a role:',
      choices: roles
    },
    {

      type: 'list',
      name: 'manager_id',
      message: 'Choose a manager:',
      choices: employees
    }
    ])
    .then (employee => {
      db.query('INSERT INTO employee SET ?', employee, (err) => {
        if (err) {console.log(err)}
        console.log('Employee created')
        mainMenu()
      })
    })
    .catch (err => console.log(err))
  })
})
}
const addRole = () => {
  db.query(`SELECT * FROM department`, (err, departments) => {
    if (err) {console.log(err)}

  departments = departments.map(department => ({
      name: department.name,
      value: department.id
    }))
  prompt([
{
  type: 'input',
  name: 'title',
  message: 'What is the title of the role?'
},
{
  type: 'list',
  name: 'department_id',
  message: 'What department is this role in?',
  choices: departments
},
{
  type: 'input',
  name: 'salary',
  message: 'What is the salary of the role?'
}

  ])
  .then(role => {
    db.query('INSERT INTO role SET ?', role, (err) => {
      if (err) {console.log(err)}
      console.log('Role Created')
      mainMenu()
    })
  })
  .catch(err => console.log(err))

})
}

const addDepartment = () => {
  prompt({
    type: 'input',
    name: 'name',
    message: 'What is the name of the department?'
  })
  .then(department => {
    db.query('INSERT INTO department SET ?', department, (err) => {
      if (err) { console.log(err) }
      console.log('Department Created!')
      mainMenu()
    })
  })
  .catch(err => console.log(err))
}


const updateEmployeeRole = () => {
  db.query(`SELECT * FROM role`, (err, roles) => {
    if (err) { console.log(err) }

    roles = roles.map(role => ({
      name: role.title,
      value: role.id
    }))

    db.query(`
      SELECT * FROM employee`, (err, employees) => {
      if (err) { console.log(err) }

      employees = employees.map(employee => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id
      }))

      prompt([
        {
          type: 'list',
          name: 'employee_id',
          message: 'Which employee would you like to update?',
          choices: employees
        },
        {
          type: 'list',
          name: 'role_id',
          message: 'Please select a role for employee',
          choices: roles
        }
      ])
      .then(({ employee_id, role_id }) => {
        db.query(`
          UPDATE employee
          SET role_id = ?
          WHERE id = ?
        `, [role_id, employee_id], err => {
          if (err) { console.log(err) }
          console.log('Employee role is now updated!')
          mainMenu()
        })
      })
      .catch(err => { console.log(err) })  
    })
  })
}

const viewDepartments = () => {
  db.query(`
  SELECT * FROM department`, (err, departments) => {
    if (err) {console.log(err)}
    console.table(departments)
    mainMenu()
  })
  }

const viewRoles = () => {
db.query(`SELECT role.title, role.salary FROM role`, (err, roles) => {
  if (err) {console.log(err)}
  console.table(roles)
  mainMenu()
})
}

const viewEmployees = () => {
  db.query(`
  SELECT employee.id, employee.first_name, employee.last_name,
        role.title, role.salary, department.name AS department,
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager
      FROM employee
      LEFT JOIN role
      ON employee.role_id = role.id
      LEFT JOIN department
      ON role.department_id = department.id
      LEFT JOIN employee manager
      ON manager.id = employee.manager_id
    `, (err, employees) => {
      if (err) { console.log(err) }
      console.table(employees)
      mainMenu()
  })
  }

  // menu where user controls which function runs 
const mainMenu = () => {
  prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'Choose an action:',
      choices: [
        {
          name: 'View Employees',
          value: 'viewEmployees'
        },
        {
          name: 'Add An Employee',
          value: 'addEmployee'
        },
        {
          name: `Update An Employee's Role`,
          value: 'updateEmployeeRole'
        },
        {
          name: 'View Departments',
          value: 'viewDepartments'
        },
        {
          name: 'Add A Department',
          value: 'addDepartment'
        },
        {
          name: 'View Roles',
          value: 'viewRoles'
        },
        {
          name: 'Add A Role',
          value: 'addRole'
        }
        ,
        {
          name: 'Be Done',
          value: 'done'
        }
      ]
    }
  ])
  // switch case to run functions based on choice 
    .then(({ choice }) => {
      switch (choice) {
        case 'viewEmployees':
          viewEmployees()
          break
        case 'addEmployee':
          addEmployee()
          break
        case 'updateEmployeeRole':
          updateEmployeeRole()
          break
        case 'viewDepartments':
          viewDepartments()
          break
        case 'addDepartment':
          addDepartment()
          break
        case 'viewRoles':
          viewRoles()
          break
        case 'addRole':
          addRole()
          break
          case 'done':
          process.exit()
      }
    })
    .catch(err => console.log(err))
}

// starts the function 
mainMenu()