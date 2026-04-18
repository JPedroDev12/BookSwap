DROP DATABASE IF EXISTS BookSwap;
CREATE DATABASE BookSwap;
USE BookSwap;

CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR (100) NOT NULL,
    email VARCHAR (100) NOT NULL UNIQUE,
    CPF CHAR (11) UNIQUE,
    password VARCHAR (50) NOT NULL,
    theme_status ENUM ('Modo claro', 'Modo escuro') DEFAULT 'Modo claro',
    created_at TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE user_page (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    description TEXT,
    phoyo_url VARCHAR(300),
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
    year_published YEAR,
    created_at TIMESTAMP DEFAULT current_timestamp,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE user_book (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    status ENUM ('Quero ler', 'Lendo', 'Lidos', 'Gostei', 'Não Gostei') NOT NULL DEFAULT 'Quero ler',
    FOREIGN KEY (user_id) REFERENCES user (id),
    FOREIGN KEY (book_id) REFERENCES book (id)
);

CREATE TABLE book_trade (
    id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user (id),
    FOREIGN KEY (book_id) REFERENCES book (id)
);

CREATE TABLE swapping (
    id INT AUTO_INCREMENT PRIMARY KEY,
    swapping_id INT NOT NULL,
    book_trade_id INT NOT NULL,
    action ENUM ('like', 'dislike', 'skip') NOT NULL,
    UNIQUE KEY uq_swapping (swapping_id, book_id), -- faz o usuario reagir apenas uma vez nesse livro ou seja, ou ele da like, dislike ou skip.
    FOREIGN KEY (swapping_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES book_trade(id) ON DELETE CASCADE
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

CREATE TABLE message (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chat_id INT NOT NULL,
    author_id INT NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT current_timestamp,
    FOREIGN KEY (chat_id) REFERENCES chat(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES user(id)
);