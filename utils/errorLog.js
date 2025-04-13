const fs = require('fs');
const path = require('path');

const logDir = path.join(process.cwd(), 'logs');

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const errorLogPath = path.join(logDir, 'error.log');

function logError(message, data = null) {
    const timestamp = new Date().toLocaleString();
    const log = `[${timestamp}] ${message}\n` +
        (data ? JSON.stringify(data, null, 2) + '\n' : '');
    fs.appendFileSync(errorLogPath, log, 'utf8');
}

module.exports = { logError };
