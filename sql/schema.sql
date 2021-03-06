DROP DATABASE IF EXISTS employees_db;

CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department (
id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
name VARCHAR(30) UNIQUE NOT NULL
);

USE employees_db;

CREATE TABLE role (
id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
title VARCHAR(30) UNIQUE NOT NULL,
salary DECIMAL UNSIGNED NOT NULL,
department_id INT UNSIGNED NOT NULL,
FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);


USE employees_db;

CREATE TABLE employee (
id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT NOT NULL,
manager_id INT,
FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);