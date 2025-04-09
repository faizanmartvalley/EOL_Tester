const sqlite3 = require("sqlite3").verbose();

exports.databaseConnection = (filePath) => {
    return new Promise((resolve, reject) => {
        if (!filePath) {
            return reject(new Error("Database file path is required"));
        }
        const db = new sqlite3.Database(filePath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
            if (err) {
                console.error("Error while connecting to SQLite database:", err.message);
                return reject(new Error(`Error while connecting to SQLite database: ${err.message}`));
            }

            console.log(`Connected to SQLite database: ${filePath}`);
            resolve(db);
        });
    });
};


