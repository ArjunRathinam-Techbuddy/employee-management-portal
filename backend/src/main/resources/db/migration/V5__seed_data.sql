-- V5__seed_data.sql
-- Passwords are bcrypt of 'Admin@123' and 'Employee@1'

-- ── Users ─────────────────────────────────────────────────────────────────────
INSERT INTO users (email, password_hash, role, is_active) VALUES
('admin@company.com',    '$2b$12$H1/IbcVtuePdBlOkudYyXO61.SMEqqxqQhnLj.sx.RgVww.MF9KHm', 'ADMIN',    TRUE),
('alice@company.com',    '$2b$12$nbwof2K6i3B34j.2z9sVOObqH5BdaQLE5K1LKpmOSomcp51pWjG4O', 'EMPLOYEE', TRUE),
('bob@company.com',      '$2b$12$nbwof2K6i3B34j.2z9sVOObqH5BdaQLE5K1LKpmOSomcp51pWjG4O', 'EMPLOYEE', TRUE),
('carol@company.com',    '$2b$12$nbwof2K6i3B34j.2z9sVOObqH5BdaQLE5K1LKpmOSomcp51pWjG4O', 'EMPLOYEE', TRUE),
('dave@company.com',     '$2b$12$nbwof2K6i3B34j.2z9sVOObqH5BdaQLE5K1LKpmOSomcp51pWjG4O', 'EMPLOYEE', TRUE),
('eve@company.com',      '$2b$12$nbwof2K6i3B34j.2z9sVOObqH5BdaQLE5K1LKpmOSomcp51pWjG4O', 'EMPLOYEE', TRUE),
('frank@company.com',    '$2b$12$nbwof2K6i3B34j.2z9sVOObqH5BdaQLE5K1LKpmOSomcp51pWjG4O', 'EMPLOYEE', TRUE),
('grace@company.com',    '$2b$12$nbwof2K6i3B34j.2z9sVOObqH5BdaQLE5K1LKpmOSomcp51pWjG4O', 'EMPLOYEE', TRUE),
('henry@company.com',    '$2b$12$nbwof2K6i3B34j.2z9sVOObqH5BdaQLE5K1LKpmOSomcp51pWjG4O', 'EMPLOYEE', TRUE),
('iris@company.com',     '$2b$12$nbwof2K6i3B34j.2z9sVOObqH5BdaQLE5K1LKpmOSomcp51pWjG4O', 'EMPLOYEE', TRUE),
('jack@company.com',     '$2b$12$nbwof2K6i3B34j.2z9sVOObqH5BdaQLE5K1LKpmOSomcp51pWjG4O', 'EMPLOYEE', TRUE);

-- ── Departments (head assigned after employees are inserted) ──────────────────
INSERT INTO departments (name, description) VALUES
('Engineering',   'Software engineering and architecture'),
('Human Resources','HR operations and recruitment'),
('Sales',         'Revenue and client management');

-- ── Employees ─────────────────────────────────────────────────────────────────
-- Engineering team (dept id=1)
INSERT INTO employees (user_id, employee_code, first_name, last_name, department_id, designation, date_of_joining, salary, phone) VALUES
((SELECT id FROM users WHERE email='alice@company.com'),  'EMP001', 'Alice',  'Smith',   1, 'Senior Software Engineer', '2021-03-15', 95000.00, '9876543210'),
((SELECT id FROM users WHERE email='bob@company.com'),    'EMP002', 'Bob',    'Johnson', 1, 'Software Engineer',        '2022-07-01', 75000.00, '9876543211'),
((SELECT id FROM users WHERE email='carol@company.com'),  'EMP003', 'Carol',  'Williams',1, 'QA Engineer',              '2022-09-12', 70000.00, '9876543212'),
((SELECT id FROM users WHERE email='dave@company.com'),   'EMP004', 'Dave',   'Brown',   1, 'DevOps Engineer',          '2023-01-20', 80000.00, '9876543213');

-- HR team (dept id=2)
INSERT INTO employees (user_id, employee_code, first_name, last_name, department_id, designation, date_of_joining, salary, phone) VALUES
((SELECT id FROM users WHERE email='eve@company.com'),    'EMP005', 'Eve',    'Davis',   2, 'HR Manager',               '2020-05-10', 90000.00, '9876543214'),
((SELECT id FROM users WHERE email='frank@company.com'),  'EMP006', 'Frank',  'Miller',  2, 'HR Executive',             '2023-03-08', 60000.00, '9876543215');

-- Sales team (dept id=3)
INSERT INTO employees (user_id, employee_code, first_name, last_name, department_id, designation, date_of_joining, salary, phone) VALUES
((SELECT id FROM users WHERE email='grace@company.com'),  'EMP007', 'Grace',  'Wilson',  3, 'Sales Manager',            '2021-11-01', 88000.00, '9876543216'),
((SELECT id FROM users WHERE email='henry@company.com'),  'EMP008', 'Henry',  'Moore',   3, 'Sales Executive',          '2022-04-15', 65000.00, '9876543217'),
((SELECT id FROM users WHERE email='iris@company.com'),   'EMP009', 'Iris',   'Taylor',  3, 'Sales Executive',          '2023-06-20', 65000.00, '9876543218'),
((SELECT id FROM users WHERE email='jack@company.com'),   'EMP010', 'Jack',   'Anderson',3, 'Business Analyst',         '2024-01-10', 72000.00, '9876543219');

-- ── Assign managers ────────────────────────────────────────────────────────────
UPDATE employees SET manager_id = (SELECT id FROM employees WHERE employee_code='EMP001')
WHERE employee_code IN ('EMP002','EMP003','EMP004');

UPDATE employees SET manager_id = (SELECT id FROM employees WHERE employee_code='EMP005')
WHERE employee_code = 'EMP006';

UPDATE employees SET manager_id = (SELECT id FROM employees WHERE employee_code='EMP007')
WHERE employee_code IN ('EMP008','EMP009','EMP010');

-- ── Assign department heads ────────────────────────────────────────────────────
UPDATE departments SET head_employee_id = (SELECT id FROM employees WHERE employee_code='EMP001') WHERE name='Engineering';
UPDATE departments SET head_employee_id = (SELECT id FROM employees WHERE employee_code='EMP005') WHERE name='Human Resources';
UPDATE departments SET head_employee_id = (SELECT id FROM employees WHERE employee_code='EMP007') WHERE name='Sales';

-- ── Sample leave requests ──────────────────────────────────────────────────────
INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, reason, status) VALUES
((SELECT id FROM employees WHERE employee_code='EMP002'), 'CASUAL', CURRENT_DATE + 5,  CURRENT_DATE + 7,  'Personal work',    'PENDING'),
((SELECT id FROM employees WHERE employee_code='EMP003'), 'SICK',   CURRENT_DATE + 10, CURRENT_DATE + 12, 'Medical checkup',  'PENDING'),
((SELECT id FROM employees WHERE employee_code='EMP008'), 'ANNUAL', CURRENT_DATE + 15, CURRENT_DATE + 20, 'Family vacation',  'PENDING');
