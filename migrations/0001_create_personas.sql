CREATE TABLE IF NOT EXISTS personas (
	id INTEGER PRIMARY KEY,
	nombre TEXT NOT NULL,
	edad INTEGER NOT NULL
);

INSERT OR IGNORE INTO personas (id, nombre, edad)
VALUES (1, 'Ana', 20);