-- Active: 1674694595000@@35.226.146.116@3306@jbl-4417097-vinicio-oliveira

CREATE TABLE IF NOT EXISTS Users_Cookenu (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    email VARCHAR(64) NOT NULL,
    password VARCHAR(64) NOT NULL
);