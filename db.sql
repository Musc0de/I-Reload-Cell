-- Tabel admin
CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

    -- Tabel user
    CREATE TABLE user (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        point INT DEFAULT 0,
        phone VARCHAR(20),
        address VARCHAR(255)
    );

-- Tabel activity
CREATE TABLE activity (

    id INT AUTO_INCREMENT PRIMARY KEY,
    username 
    last_login DATETIME,
    last_trx DATETIME,
    last_redeem DATETIME,
    point_changes INT,
    point_berkurang INT,
    top_up_plus INT,
    top_up_minus INT
);

-- Tabel klaim code
CREATE TABLE klaim_code (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code_voc VARCHAR(50) NOT NULL,
    point_voc_give INT,
    tanggal_aktif_code DATE,
    tanggal_exp_code DATE,
    tanggal_add_code DATE
);

-- Tabel product_redeem_code
CREATE TABLE product_redeem_code (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_product VARCHAR(255) NOT NULL,
    deskripsi_produk TEXT,
    stok INT DEFAULT 0,
    img_produk VARCHAR(255),
    price_product_to_redeem INT,
    sold INT DEFAULT 0,
    last_sold_redeem DATETIME
);
