CREATE TABLE members (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(50),
    EmailAddress VARCHAR(50),
    password DECIMAL(10,0)
);




CREATE TABLE membership (
    membership_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT UNSIGNED,
    plan VARCHAR(255),
    amount DECIMAL(6,0)
);



CREATE TABLE classes (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT UNSIGNED,
    name VARCHAR(200)
);



CREATE TABLE attendance (
    memberID BIGINT UNSIGNED,
    AttendanceDate DATE,
    AttendanceStatus ENUM('Present', 'Absent') DEFAULT 'Present'
);



CREATE TABLE pricing (
    PlanID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    PlanName VARCHAR(100) NOT NULL,
    Price DECIMAL(10,2) NOT NULL
);
