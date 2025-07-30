import os from "node:os";
import fs from "node:fs";
import path from "node:path";
import { parse } from "jsonc-parser";
import { execSync } from "node:child_process";

const backupDir = path.normalize(`${path.resolve(process.cwd())}/backup`);
const BACKUP = "backup";
const RESTORE = "restore";
const platform = os.platform();
const type = os.type();
const release = os.release();
const arch = os.arch();
const isDryRun = process.argv[3] === "dry-run";

const colorize = {
  error: (msg) => `\x1b[31m${msg}\x1b[0m`, // Red
  success: (msg) => `\x1b[32m${msg}\x1b[0m`, // Green
  info: (msg) => `\x1b[34m${msg}\x1b[0m`, // Blue
  warning: (msg) => `\x1b[33m${msg}\x1b[0m`, // Yellow
};

(() => {
  try {
    const content = fs.readFileSync("config.jsonc", "utf-8");
    const config = parse(content);

    if (process.argv[2] === BACKUP) {
      config[platform].paths.forEach((pathname) => {
        const normalizedPath = path.normalize(pathname);
        const resolvedPath = path.resolve(normalizedPath);

        if (!fs.existsSync(resolvedPath)) {
          console.error(colorize.error(`Path does not exist: ${resolvedPath}`));
          return; // Skip to the next path
        }

        const destination = path.join(backupDir, path.basename(resolvedPath));

        const stats = fs.statSync(resolvedPath);
        if (stats.isDirectory()) {
          if (isDryRun) {
            console.log(
              colorize.info(
                `[Dry-run] Directory would be backed up to: ${destination}`,
              ),
            );
          } else {
            fs.mkdirSync(backupDir, { recursive: true }); // Ensure backup directory exists
            fs.rmSync(destination, { recursive: true, force: true }); // Remove existing directory
            fs.cpSync(resolvedPath, destination, { recursive: true });
            console.log(
              colorize.success(`Directory backed up to: ${destination}`),
            );
          }
        } else {
          if (isDryRun) {
            console.log(
              colorize.info(
                `[Dry-run] File would be backed up to: ${destination}`,
              ),
            );
          } else {
            fs.mkdirSync(backupDir, { recursive: true }); // Ensure backup directory exists
            fs.rmSync(destination, { force: true }); // Remove existing file
            fs.copyFileSync(resolvedPath, destination);
            console.log(colorize.success(`File backed up to: ${destination}`));
          }
        }
      });

      config[platform].commands.forEach((command) => {
        if (isDryRun) {
          console.log(
            colorize.info(
              `[Dry-run] Command would be executed: ${command.backup}`,
            ),
          );
        } else {
          try {
            execSync(command.backup, {
              stdio: "inherit",
              shell: platform === "win32" ? "powershell.exe" : undefined,
            });
            console.log(
              colorize.success(`Command executed: ${command.backup}`),
            );
          } catch (error) {
            console.error(
              colorize.error(`Failed to execute: ${command.backup}`),
            );
          }
        }
      });
    } else if (process.argv[2] === RESTORE) {
      config[platform].paths.forEach((pathname) => {
        const normalizedPath = path.normalize(pathname);
        const resolvedPath = path.resolve(normalizedPath);

        const backupPath = path.join(backupDir, path.basename(resolvedPath));

        if (!fs.existsSync(backupPath)) {
          console.error(
            colorize.error(`Backup does not exist for: ${resolvedPath}`),
          );
          return; // Skip to the next path
        }

        const stats = fs.statSync(backupPath);
        if (stats.isDirectory()) {
          if (isDryRun) {
            console.log(
              colorize.info(
                `[Dry-run] Directory would be restored to: ${resolvedPath}`,
              ),
            );
          } else {
            fs.rmSync(resolvedPath, { recursive: true, force: true }); // Remove existing directory
            fs.cpSync(backupPath, resolvedPath, { recursive: true });
            console.log(
              colorize.success(`Directory restored to: ${resolvedPath}`),
            );
          }
        } else {
          if (isDryRun) {
            console.log(
              colorize.info(
                `[Dry-run] File would be restored to: ${resolvedPath}`,
              ),
            );
          } else {
            fs.rmSync(resolvedPath, { force: true }); // Remove existing file
            fs.copyFileSync(backupPath, resolvedPath);
            console.log(colorize.success(`File restored to: ${resolvedPath}`));
          }
        }
      });

      config[platform].commands.forEach((command) => {
        if (isDryRun) {
          console.log(
            colorize.info(
              `[Dry-run] Command would be executed: ${command.restore}`,
            ),
          );
        } else {
          try {
            execSync(command.restore, {
              stdio: "inherit",
              shell: platform === "win32" ? "powershell.exe" : undefined,
            });
            console.log(
              colorize.success(`Command executed: ${command.restore}`),
            );
          } catch (error) {
            console.error(
              colorize.error(`Failed to execute: ${command.restore}`),
            );
          }
        }
      });
    } else {
      throw new Error(
        colorize.warning(
          `Provide a valid argument: npm start <backup | restore> [dry-run]`,
        ),
      );
    }
  } catch (error) {
    console.error(colorize.error(error.message));
  }
})();
