const findUp = require("../dist/compiled/common-packages.js").findUp();

// find-up 6.* changed its exports
// This makes it compatible with both find-up 5.* and 6.*
const findUpExport = findUp.findUp;
findUpExport.sync = findUp.findUpSync;
findUpExport.findUpSync = findUp.findUpSync;
findUpExport.stop = findUp.findUpStop;
findUpExport.findUpStop = findUp.findUpStop;
findUpExport.exists = findUp.pathExists;
findUpExport.pathExists = findUp.pathExists;
findUpExport.sync.exists = findUp.pathExistsSync;
findUpExport.pathExistsSync = findUp.pathExistsSync;

module.exports = findUpExport;
