CREATE TABLE user_details (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    email VARCHAR(255),
    mobile BIGINT(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type ENUM('1', '2'),
    otp INT,
    otp_exp BIGINT,
    is_deleted TINYINT(3) DEFAULT 0,
);

ALTER TABLE user_details
ADD UNIQUE INDEX user_details_mobile_unique (mobile);

ALTER TABLE user_details
MODIFY COLUMN is_deleted tinyint(3) default 0 ;

CREATE TABLE address (
    address_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    street_address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    is_default BOOLEAN,
	is_deleted tinyint default 0,
    address_type ENUM('home', 'office', 'friends_home'),
    created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_details(user_id)
);

CREATE TABLE msp (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(255),
    img VARCHAR(255),
    type VARCHAR(50),
    timing VARCHAR(100),
    capacity INT,
    latitude DECIMAL(10, 6),
    longitude DECIMAL(10, 6),
    status TINYINT,
    delivery TINYINT,
    dpc VARCHAR(50),
    on_home_page TINYINT,
    popular TINYINT,
    rating DECIMAL(3, 2),
    bank_name VARCHAR(100),
    bank_acnt_no VARCHAR(50),
    ifsc VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES user_details(user_id),
    UNIQUE (user_id)
);

