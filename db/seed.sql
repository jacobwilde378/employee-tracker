USE employee_tracker_db;


INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES 
        ('Jacob','Wilde',3,null),
        ('Troy','Berry',1,1),
        ('Rickey','Ramirez',5,2),
        ('Paul','Perschon',6,2),
        ('Rose','Coon',2,1),
        ('Channon','Masock',5,2),
        ('Jessica','VanWagenen',4,2)
;

INSERT INTO department (name) 
    VALUES 
        ('Information Systems'),
        ('Lending'),
        ('Administration')
;

INSERT INTO role (title, salary, department_id)
    VALUES
        ('IT Manager', 250000.00, 1),
        ('Lending Manager', 150000.00, 2),
        ('CEO', 500000.00, 3),
        ('Network Admin', 130000.00, 1),
        ('Report Writer', 80000.00, 1),
        ('Server Admin', 80000.00, 1)
;
