import { open } from "sqlite";
import sqlite3 from "sqlite3";

let dbInstance = null;

export async function initdb() {
    if (dbInstance) return;

    dbInstance = await open({
        filename: "db/Todos.db",
        driver: sqlite3.Database,
    });

    // Create the USER table (make sure the table name is consistent)
    await dbInstance.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )
    `);

    // Create the todos table, referencing the users table
    await dbInstance.exec(`
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            task TEXT,
            completed BOOLEAN DEFAULT 0,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    `);
}

export function getDB() {
    if (!dbInstance) {
        throw new Error("InitDb must be called before getDB");
    }
    return dbInstance;
};