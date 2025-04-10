const xlsx = require("xlsx");
const path = require("path");

// const directoryPath = "C:/Users/Martvalley/OneDrive/Desktop/Cygni Data";


exports.processExcel = async (filePath) => {
    try {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

        let barCode = null;
        for (let i = 0; i < 5; i++) {
            if (jsonData[i] && jsonData[i][0] && jsonData[i][0].toString().toLowerCase().includes("barcode")) {
                barCode = jsonData[i][1];
                break;
            }
        }

        let schemeIndex = jsonData[1] ? jsonData[1].indexOf("Scheme:") : -1;
        let scheme = (schemeIndex !== -1) ? jsonData[1][schemeIndex + 1] : "Not Found";

        let structuredData = {
            BarCode: barCode,
            Scheme: scheme,
            TestItems: []
        };

        const headers = jsonData[2];
        let lastTestItem = null;

        const paramBlockSize = 6;

        for (let i = 3; i < jsonData.length; i++) {
            const row = jsonData[i];

            if (row[0] && row[0].toString().trim() !== "") {
                lastTestItem = {
                    TestItem: row[0] || null,
                    StartTime: row[1] || null,
                    Duration: row[2] || null,
                    Parameters: []
                };
                structuredData.TestItems.push(lastTestItem);
            }

            if (lastTestItem) {
                for (let j = 3; j < headers.length; j += paramBlockSize) {
                    const param = {};

                    for (let k = 0; k < paramBlockSize; k++) {
                        const key = headers[j + k];
                        const value = row[j + k];
                        if (key) {
                            param[key] = value || null;
                        }
                    }

                    if (Object.values(param).some(val => val !== null)) {
                        lastTestItem.Parameters.push(param);
                    }
                }
            }
        }
        return structuredData;
    } catch (error) {
        throw new Error(`Error processing Excel file: ${error.message || error}`);
    }
}