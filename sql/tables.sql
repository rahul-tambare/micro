CREATE TABLE user_details (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    email VARCHAR(255),
    mobile_no BIGINT(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type ENUM('1', '2')
);