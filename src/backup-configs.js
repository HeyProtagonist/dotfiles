import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import chalk from "chalk";

/**
 * Backup VSCode extensions.
 * @param {string} backupDir - The backup directory path.
 */
function backupVSCodeExtensions(backupDir) {
  try {
    const extensionsListFile = path.join(backupDir, "vscode-extensions.txt");
    const extensionsList = execSync("code --list-extensions", {
      encoding: "utf-8",
    });

    fs.writeFileSync(extensionsListFile, extensionsList.trim());
    console.log(
      chalk.green(`VSCode extensions backed up to: ${extensionsListFile}`),
    );
  } catch (error) {
    console.error(
      chalk.red(`Failed to backup VSCode extensions: ${error.message}`),
    );
  }
}

/**
 * Backup configuration files and directories into a structured folder.
 */
export default function backupConfigs() {
  const backupDir = path.join(process.cwd(), "backup"); // Backup directory

  const configPaths = [
    // VIM
    { path: "~/.vimrc", name: "vimrc" },
    { path: "~/.vim", name: "vim/" },
    { path: "~/.config/nvim", name: "nvim/" },

    // BASH
    { path: "~/.bashrc", name: "bashrc" },
    { path: "~/.bash_profile", name: "bash_profile" },
    { path: "~/.bash_aliases", name: "bash_aliases" },
    { path: "~/.bash_history", name: "bash_history" },
    { path: "~/.inputrc", name: "inputrc" },

    // Hyper Terminal
    { path: "~/AppData/Roaming/Hyper/.hyper.js", name: ".hyper.js" },

    /* C:\Users\2420\AppData\Roaming\Code\User */
    // VSCode
    {
      path: "~/AppData/Roaming/Code/User/settings.json",
      name: "vscode/settings.json",
    },
    {
      path: "~/AppData/Roaming/Code/User/keybindings.json",
      name: "vscode/keybindings.json",
    },
    { path: "~/AppData/Roaming/Code/User/snippets", name: "vscode/snippets/" },
  ];

  const resolvedPaths = configPaths.map((config) => ({
    ...config,
    path: config.path.replace("~", process.env.HOME || process.env.USERPROFILE),
  }));

  // Ensure the backup directory exists and clear its contents
  if (fs.existsSync(backupDir)) {
    console.log(chalk.yellow(`Clearing old backup in: ${backupDir}`));
    fs.rmSync(backupDir, { recursive: true, force: true });
  }
  console.log(chalk.green(`Creating backup directory: ${backupDir}`));
  fs.mkdirSync(backupDir, { recursive: true });

  resolvedPaths.forEach(({ path: filePath, name }) => {
    const destination = path.join(backupDir, name);
    if (fs.existsSync(filePath)) {
      if (fs.lstatSync(filePath).isDirectory()) {
        console.log(
          chalk.cyan(`Copying directory: ${filePath} -> ${destination}`),
        );
        copyDirectory(filePath, destination);
      } else {
        console.log(chalk.cyan(`Copying file: ${filePath} -> ${destination}`));
        copyFile(filePath, destination);
      }
    } else {
      console.warn(chalk.red(`Warning: ${filePath} not found! Skipping...`));
    }
  });

  backupVSCodeExtensions(backupDir);

  console.log(
    chalk.greenBright(`Backup complete! Files are saved in: ${backupDir}`),
  );
}

/**
 * Copy a file to a destination.
 * @param {string} source - The source file path.
 * @param {string} destination - The destination file path.
 */
function copyFile(source, destination) {
  const destinationDir = path.dirname(destination);
  if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir, { recursive: true });
  }
  fs.copyFileSync(source, destination);
}

/**
 * Copy a directory to a destination recursively.
 * @param {string} source - The source directory path.
 * @param {string} destination - The destination directory path.
 */
function copyDirectory(source, destination) {
  fs.mkdirSync(destination, { recursive: true });
  fs.readdirSync(source).forEach((item) => {
    const sourcePath = path.join(source, item);
    const destinationPath = path.join(destination, item);
    if (fs.lstatSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, destinationPath);
    } else {
      copyFile(sourcePath, destinationPath);
    }
  });
}
