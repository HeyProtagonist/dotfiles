import backupConfigs from "./backup-configs.js";
import restoreConfigs from "./restore-configs.js";

(function () {
  const parameters = process.argv.slice(2, process.argv.length);
  const args = parameters.map((param) => param.replace("--", ""));
  const isBackup = args[0] !== "restore";

  isBackup ? backupConfigs() : restoreConfigs();

  process.exit(0);
})();
