#!/usr/bin/env node

import { promises as fs } from "fs";
import path from "path";
import { exec } from "child_process";
import os from "os";

const homeDir = os.homedir();
const rootDir = process.cwd(); // Root project directory (for backup)
const backupDir = path.join(rootDir, "backup");
const targetFilePath = path.join(rootDir, "target.json");

// Function to convert paths to absolute POSIX format
const toPosixPath = (filePath) => {
  if (!filePath) return null;

  let absolutePath = filePath.replace("$HOME", homeDir); // Replace placeholder
  absolutePath = path.isAbsolute(absolutePath)
    ? absolutePath
    : path.join(homeDir, absolutePath); // Ensure absolute path

  return path.posix.normalize(absolutePath.replace(/\\/g, "/")); // Convert to POSIX format
};

// Function to check if a file/folder exists
async function exists(path) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

// Helper function to execute shell commands and save output to backup dir
function executeShellCommand(command, outputFile) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Command failed: ${command}`, stderr);
        reject(error);
      } else {
        if (outputFile) {
          const backupFilePath = path.join(backupDir, outputFile);
          fs.writeFile(backupFilePath, stdout, "utf-8")
            .then(() => {
              console.log(`✅ Command output saved to: ${backupFilePath}`);
              resolve(stdout);
            })
            .catch((err) => {
              console.error("❌ Failed to save output to file:", err);
              reject(err);
            });
        } else {
          console.log(stdout);
          resolve(stdout);
        }
      }
    });
  });
}

// Retrieve command line arguments
const args = process.argv.slice(2);
const isBackup = args[0] === "backup";
const dryRun = args.includes("--dry-run");

// Ensure backup directory exists
await fs.mkdir(backupDir, { recursive: true });

(async () => {
  try {
    // Read the target.json configuration
    const rawData = await fs.readFile(targetFilePath, "utf-8");
    const config = JSON.parse(rawData);

    if (isBackup) {
      console.log("Backing up files and folders...");

      // Backup files
      for (const file of config.files) {
        const src = toPosixPath(file);
        if (await exists(src)) {
          const dest = path.join(backupDir, path.basename(src));
          if (!dryRun) {
            await fs.copyFile(src, dest);
          }
          console.log(`✅ Backed up: ${src} → ${dest}`);
        }
      }

      // Backup folders
      for (const folder of config.folders) {
        const src = toPosixPath(folder);
        if (await exists(src)) {
          const dest = path.join(backupDir, path.basename(src));
          if (!dryRun) {
            await fs.cp(src, dest, { recursive: true });
          }
          console.log(`✅ Backed up: ${src} → ${dest}`);
        }
      }

      // Execute shell backup scripts
      for (const shellTask of config.shell) {
        const outputFile = toPosixPath(shellTask.outputFile);
        const script = shellTask["backup-script"].replace("$HOME", homeDir);

        if (!dryRun) {
          await executeShellCommand(
            script,
            outputFile ? path.basename(outputFile) : null,
          );
        }
        console.log(`✅ Executed backup script: ${script}`);
      }
    } else {
      console.log("Restoring files and folders...");

      // Restore files
      for (const file of config.files) {
        const dest = toPosixPath(file);
        const src = path.join(backupDir, path.basename(dest));
        if (await exists(src)) {
          if (!dryRun) {
            await fs.copyFile(src, dest);
          }
          console.log(`✅ Restored: ${src} → ${dest}`);
        }
      }

      // Restore folders
      for (const folder of config.folders) {
        const dest = toPosixPath(folder);
        const src = path.join(backupDir, path.basename(dest));
        if (await exists(src)) {
          if (!dryRun) {
            await fs.cp(src, dest, { recursive: true });
          }
          console.log(`✅ Restored: ${src} → ${dest}`);
        }
      }

      // Execute shell restore scripts
      for (const shellTask of config.shell) {
        const script = shellTask["restore-script"].replace("$HOME", homeDir);

        if (!dryRun) {
          await executeShellCommand(script, null); // No file output on restore
        }
        console.log(`✅ Executed restore script: ${script}`);
      }
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
})();
