DROP DATABASE IF EXISTS BookSwap;
CREATE DATABASE BookSwap;
USE BookSwap;

CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR (100) NOT NULL,
    email VARCHAR (100) NOT NULL UNIQUE,
    CPF CHAR (11) UNIQUE,
    password VARCHAR (255) NOT NULL,
    theme_status ENUM ('Modo claro', 'Modo escuro') DEFAULT 'Modo claro',
    is_admin BOOLEAN NOT NULL DEFAULT FALSE, -- só quem tem is_admin = TRUE pode cadastrar livros na Loja
    create_at TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE user_page (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    description TEXT,
    photo_url MEDIUMTEXT,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE book (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR (200) NOT NULL,
    author VARCHAR (100),
    isbn VARCHAR (13) UNIQUE,
    cover_url VARCHAR (300),
    description TEXT,
    genre VARCHAR (100),
    year_published INT,
    price DECIMAL (10,2) NOT NULL DEFAULT 0.00,
    listed_in_store BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT current_timestamp,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE user_book (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    status ENUM ('Quero ler', 'Lendo', 'Lidos', 'Gostei', 'Não Gostei') NOT NULL DEFAULT 'Quero ler',
    rating TINYINT NULL,
    UNIQUE KEY uq_user_book (user_id, book_id),
    FOREIGN KEY (user_id) REFERENCES user (id),
    FOREIGN KEY (book_id) REFERENCES book (id)
);

CREATE TABLE book_trade (
    id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT NOT NULL,
    user_id INT NOT NULL,
    UNIQUE KEY uq_book_trade (user_id, book_id),
    FOREIGN KEY (user_id) REFERENCES user (id),
    FOREIGN KEY (book_id) REFERENCES book (id)
);

CREATE TABLE swapping (
    id INT AUTO_INCREMENT PRIMARY KEY,
    swapping_id INT NOT NULL, -- Usuario
    book_trade_id INT NOT NULL,
    action ENUM ('like', 'dislike', 'skip') NOT NULL,
    UNIQUE KEY uq_swapping (swapping_id, book_trade_id), -- faz o usuario reagir apenas uma vez nesse livro ou seja, ou ele da like, dislike ou skip.
    FOREIGN KEY (swapping_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (book_trade_id) REFERENCES book_trade(id) ON DELETE CASCADE
);

CREATE TABLE likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, -- pessoa curtida
    book_id INT NOT NULL, -- livro curtido
    created_at TIMESTAMP DEFAULT current_timestamp,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (book_id) REFERENCES book(id)
);

CREATE TABLE matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user1_id INT NOT NULL,
    user2_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT current_timestamp,
    FOREIGN KEY (user1_id) REFERENCES user (id),
    FOREIGN KEY (user2_id) REFERENCES user (id)
);

CREATE TABLE chat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user1_id INT NOT NULL,
    user2_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT current_timestamp,
    FOREIGN KEY (user1_id) REFERENCES user(id),
    FOREIGN KEY (user2_id) REFERENCES user(id)
);

CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chat_id INT NOT NULL,
    author_id INT NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT current_timestamp,
    FOREIGN KEY (chat_id) REFERENCES chat(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES user(id)
);

ALTER TABLE user_book
  ADD COLUMN rating TINYINT NULL AFTER status;

ALTER TABLE user_book
  ADD UNIQUE KEY uq_user_book (user_id, book_id);

ALTER TABLE book_trade
  ADD UNIQUE KEY uq_book_trade (user_id, book_id);

ALTER TABLE book
  ADD COLUMN price DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER year_published;

ALTER TABLE user_page
  MODIFY COLUMN photo_url MEDIUMTEXT;

ALTER TABLE book
  ADD COLUMN listed_in_store BOOLEAN NOT NULL DEFAULT TRUE AFTER price;

-- Só quem tem is_admin = TRUE pode cadastrar livros na Loja (ver bookController).
ALTER TABLE user
  ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT FALSE;

-- Conta de admin padrão.
-- Login: admin@bookswap.com   Senha: Admin@BookSwap123
-- (troque a senha depois do primeiro login, ela já está com hash bcrypt aqui embaixo)
INSERT INTO user (username, email, password, is_admin)
VALUES ('admin', 'admin@bookswap.com', '$2b$10$wAeP6JQwM/gkGTtti.LTU.sqA.HK5Ex/QXAZ299JdI.ZqllXSYnHi', TRUE);
