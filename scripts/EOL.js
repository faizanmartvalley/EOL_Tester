const fs = require('fs').promises;
const path = require('path');
const { fetchFilenames, insertFilename } = require("../utils/helpers");
const { processExcel } = require("../utils/Read_EOL_Exclel");
const { logError } = require("../utils/errorLog");


const directoryPath = "C:/Users/LENOVO/Desktop/Cygni Data";
// const directoryPath = "C:/Users/Martvalley/OneDrive/Desktop/Cygni Data"

let orderID = "";
let hasLogged = false;
exports.scan_OK_Files = async () => {
    try {
        if (!orderID) {
            console.log("Order ID not found", new Date().toLocaleString());
            return;
        }
        if (!hasLogged) {
            console.log("Order ID configured, Started processing files", new Date().toLocaleString());
        }
        hasLogged = true;
        const fileDir = path.join(directoryPath, "OK");
        const files = await fs.readdir(fileDir);
        const excelFiles = files.filter(file => path.extname(file).toLowerCase() === ".xls");
        const processedFiles = await fetchFilenames(fileDir);
        const normalizeFilenames = processedFiles.map((filename) => {
            return path.normalize(filename)
        });

        for (const file of excelFiles) {
            const filePath = path.join(fileDir, file);
            const normalizeFileName = path.normalize(filePath);

            if (!normalizeFilenames.includes(normalizeFileName)) {
                const fileData = await processExcel(filePath);

                if (!fileData?.BarCode) {
                    console.error("Bar code is missing in", file);
                    await insertFilename(filePath, fileDir);
                    logError(`${file}, error: Bar code is missing`)
                    continue;
                }

                const response = await fetch("https://cygni.dnanetra.com/machine/EOL-data", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        ...fileData, status: "OK", orderId: orderID
                    })
                });
                const responseData = await response.json();
                if (responseData?.status == 200) {
                    await insertFilename(filePath, fileDir);
                    console.log("File data sent to MES and saved", new Date().toLocaleString());
                }
                else {
                    throw new Error(`${responseData.data}`);
                }
            }
            // else {
            //     console.log("Already read this file");
            // }
        }
    } catch (error) {
        console.error("Error processing file", error, new Date().toLocaleString());
        logError(`Something went wrong processing file,${error}`);
    }
}

exports.scan_NG_Files = async () => {
    try {
        if (!orderID) {
            console.log("Order ID not found", new Date().toLocaleString());
            return;
        }
        if (!hasLogged) {
            console.log("Order ID configured, Started processing files", new Date().toLocaleString());
        }
        hasLogged = true;
        const fileDir = path.join(directoryPath, "NG");
        const files = await fs.readdir(fileDir);
        const excelFiles = files.filter(file => path.extname(file).toLowerCase() === ".xls");
        const processedFiles = await fetchFilenames(fileDir);
        const normalizeFilenames = processedFiles.map((filename) => {
            return path.normalize(filename)
        });

        for (const file of excelFiles) {
            const filePath = path.join(fileDir, file);
            const normalizeFileName = path.normalize(filePath);

            if (!normalizeFilenames.includes(normalizeFileName)) {
                const fileData = await processExcel(filePath);

                if (!fileData?.BarCode) {
                    console.error("Bar code is missing in", file);
                    await insertFilename(filePath, fileDir);
                    logError(`${file}, error: Bar code is missing`)
                    continue;
                }

                const response = await fetch("https://cygni.dnanetra.com/machine/EOL-data", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        ...fileData, status: "NG", orderId: orderID
                    })
                });
                const responseData = await response.json();
                if (responseData?.status == 200) {
                    await insertFilename(filePath, fileDir);
                    console.log("File data sent to MES and saved", new Date().toLocaleString());
                }
                else {
                    throw new Error(`${responseData.data}`);
                }
            }
            // else {
            //     console.log("Already read this file");
            // }
        }
    } catch (error) {
        console.error("Error processing file", error, new Date().toLocaleString());
        logError(`Something went wrong processing file,${error}`);
    }
}

exports.post_orderId = async (req, res) => {
    try {
        const { order } = req.params;

        if (!order) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required.."
            })
        }
        orderID = order;
        return res.status(200).json({
            success: true,
            message: "Order ID saved successfuly..!"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${error}`
        })

    }
}