USE mi_base;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    last_name VARCHAR(400)
);

CREATE TABLE task (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150),
    description VARCHAR(400),
    priority SMALLINT,
    user_id INTEGER REFERENCES users(id)
);

INSERT INTO users (name, last_name) VALUES ('Eric', 'Domenzain');
INSERT INTO users (name, last_name) VALUES ('Jose', 'Perez');

INSERT INTO task (name, description, priority, user_id) VALUES ('Task of Eric', 'This is a Description', 1, 1);
INSERT INTO task (name, description, priority, user_id) VALUES ('Task of Jose', 'This is a Description', 1, 2);

