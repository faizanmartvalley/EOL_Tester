const fs = require('fs').promises;
const path = require('path');
const { databaseConnection } = require("./db");


exports.fetchFilenames = async (dirPath) => {
    const finalPath = path.join(dirPath, "mes_read_repower_files.db")
    try {
        try {
            await fs.access(finalPath);
        } catch {
            await fs.writeFile(finalPath, "");
            console.log("Database file created:", dirPath);

            const db = await databaseConnection(finalPath);

            await new Promise((resolve, reject) => {
                db.run(
                    `CREATE TABLE IF NOT EXISTS file_records (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        filename TEXT NOT NULL UNIQUE
                    )`,
                    (err) => {
                        if (err) {
                            console.error("Error creating table:", err.message);
                            reject(err);
                        } else {
                            console.log("Table 'file_records' is ready.");
                            resolve();
                        }
                    }
                );
            });

            db.close((err) => {
                if (err) {
                    console.error("Error closing database after initialization:", err.message);
                } else {
                    console.log("Database connection closed after initialization.");
                }
            });
        }

        return new Promise(async (resolve, reject) => {
            const db = await databaseConnection(finalPath);

            db.all("SELECT filename FROM file_records", [], (err, rows) => {
                if (err) {
                    console.error("Error fetching filenames:", err.message);
                    return reject(err);
                }
                resolve(rows.map(row => row.filename));
            });

            db.close((err) => {
                if (err) {
                    console.error("Error closing database after fetching:", err.message);
                }
            });
        });
    } catch (error) {
        console.error("Failed to fetch filenames:", error.message);
        throw error;
    }
};

exports.insertFilename = async (filename,dirPath) => {

    const dbFilePath = path.join(dirPath, "mes_read_repower_files.db")


    const db = await databaseConnection(dbFilePath);

    try {
        await new Promise((resolve, reject) => {
            db.run("INSERT INTO file_records (filename) VALUES (?)", [filename], function (err) {
                if (err) return reject(new Error("Error inserting filename: " + err.message));
                resolve(`Filename '${filename}' added successfully.`);
            });
        });
    } catch (error) {
        console.error(error.message);
        throw error;
    } finally {
        db.close((err) => {
            if (err) console.error("Error closing database after insert:", err.message);
        });
    }
};