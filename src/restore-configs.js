import fs from "fs";
import path from "path";
import chalk from "chalk";
import { execSync } from "child_process";

/**
 * Restore VSCode extensions from backup.
 * @param {string} backupDir - The backup directory path.
 */
function restoreVSCodeExtensions(backupDir) {
  const extensionsListFile = path.join(backupDir, "vscode-extensions.txt");

  if (!fs.existsSync(extensionsListFile)) {
    console.warn(
      chalk.yellow("No VSCode extensions backup found. Skipping..."),
    );
    return;
  }

  try {
    const extensions = fs
      .readFileSync(extensionsListFile, "utf-8")
      .split("\n")
      .filter(Boolean);

    console.log(
      chalk.greenBright(`Restoring ${extensions.length} VSCode extensions...`),
    );

    extensions.forEach((extension) => {
      try {
        console.log(chalk.cyan(`Installing extension: ${extension}`));
        execSync(`code --install-extension ${extension}`, { stdio: "inherit" });
      } catch (error) {
        console.error(
          chalk.red(`Failed to install ${extension}: ${error.message}`),
        );
      }
    });

    console.log(chalk.greenBright("VSCode extensions restore complete!"));
  } catch (error) {
    console.error(
      chalk.red(`Failed to restore VSCode extensions: ${error.message}`),
    );
  }
}

/**
 * Restore configuration files and directories from the backup directory.
 */
export default function restoreConfigs() {
  const backupDir = path.join(process.cwd(), "backup");

  if (!fs.existsSync(backupDir)) {
    console.error(chalk.red(`Error: Backup directory not found: ${backupDir}`));
    console.error(
      chalk.red(`Please ensure you have a valid backup before restoring.`),
    );
    return;
  }

  const backupContents = fs.readdirSync(backupDir);

  if (backupContents.length === 0) {
    console.error(chalk.red(`Error: Backup directory is empty: ${backupDir}`));
    return;
  }

  console.log(chalk.greenBright(`Restoring files from: ${backupDir}`));

  backupContents.forEach((item) => {
    const sourcePath = path.join(backupDir, item);
    const destinationPath = resolveOriginalPath(item);

    if (!destinationPath) {
      console.warn(
        chalk.yellow(
          `Warning: Unknown destination for ${item}. Attempting as generic folder or file.`,
        ),
      );

      // Attempt fallback logic: Handle as generic directory or file
      const fallbackDestination = fallbackPath(item);
      if (fallbackDestination) {
        console.log(
          chalk.cyan(
            `Fallback restore: ${sourcePath} -> ${fallbackDestination}`,
          ),
        );
        if (fs.lstatSync(sourcePath).isDirectory()) {
          restoreDirectory(sourcePath, fallbackDestination);
        } else {
          restoreFile(sourcePath, fallbackDestination);
        }
      } else {
        console.error(
          chalk.red(`Failed to determine fallback destination for ${item}.`),
        );
      }
      return;
    }

    if (fs.lstatSync(sourcePath).isDirectory()) {
      console.log(
        chalk.cyan(`Restoring directory: ${sourcePath} -> ${destinationPath}`),
      );
      restoreDirectory(sourcePath, destinationPath);
    } else {
      console.log(
        chalk.cyan(`Restoring file: ${sourcePath} -> ${destinationPath}`),
      );
      restoreFile(sourcePath, destinationPath);
    }
  });

  restoreVSCodeExtensions(backupDir);

  console.log(chalk.greenBright(`Restore complete!`));
}

/**
 * Resolves the original path of a backed-up file or directory based on its name in the backup.
 * @param {string} backupName - Name of the file or directory in the backup.
 * @returns {string|null} - The original path or null if unknown.
 */
function resolveOriginalPath(backupName) {
  const pathsMap = {
    vimrc: "~/.vimrc",
    "vim/": "~/.vim",
    vim: "~/.vim", // Root-level `vim` directory
    "nvim/": "~/.config/nvim",
    bashrc: "~/.bashrc",
    bash_profile: "~/.bash_profile",
    bash_aliases: "~/.bash_aliases",
    bash_history: "~/.bash_history",
    inputrc: "~/.inputrc",
    ".hyper.js": "~/AppData/Roaming/Hyper/.hyper.js",
    "vscode/settings.json": "~/AppData/Roaming/Code/User/settings.json",
    "vscode/keybindings.json": "~/AppData/Roaming/Code/User/keybindings.json",
    "vscode/snippets/": "~/AppData/Roaming/Code/User/snippets",
    vscode: "~/AppData/Roaming/Code/User/", // Root-level `vscode` directory
  };

  const resolvedPath = pathsMap[backupName];
  if (!resolvedPath) return null;
  return resolvedPath.replace("~", process.env.HOME || process.env.USERPROFILE);
}

/**
 * Fallback logic for undefined paths.
 * @param {string} item - Item from the backup directory.
 * @returns {string|null} - A guessed destination or null if indeterminate.
 */
function fallbackPath(item) {
  // Generic fallback directory under home directory
  const homeDir = process.env.HOME || process.env.USERPROFILE;
  if (item) {
    return path.join(homeDir, `.${item}`);
  }
  return null;
}

/**
 * Restore a file to its original location.
 * @param {string} source - The source file path.
 * @param {string} destination - The destination file path.
 */
function restoreFile(source, destination) {
  const destinationDir = path.dirname(destination);
  if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir, { recursive: true });
  }
  fs.copyFileSync(source, destination);
}

/**
 * Restore a directory to its original location recursively.
 * @param {string} source - The source directory path.
 * @param {string} destination - The destination directory path.
 */
function restoreDirectory(source, destination) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  fs.readdirSync(source).forEach((item) => {
    const sourcePath = path.join(source, item);
    const destinationPath = path.join(destination, item);

    if (fs.lstatSync(sourcePath).isDirectory()) {
      restoreDirectory(sourcePath, destinationPath);
    } else {
      restoreFile(sourcePath, destinationPath);
    }
  });
}
