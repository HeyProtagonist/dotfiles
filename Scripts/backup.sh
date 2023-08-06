#!/bin/bash

# Backup VIM `.vimrc`
# Logic goes here...

# Backup VSCode `settings.json`, `keybindings.json`
cp -r $HOME/AppData/Roaming/Code/User/*.json $HOME/.dotfiles/VSCode

# Backup VSCode `extensions` to `extensions.json`
code --list-extensions >$HOME/.dotfiles/VSCode/extensions.json

# Backup Hyper Terminal `.hyper.js`
cp -r $HOME/AppData/Roaming/Hyper/.hyper.js $HOME/.dotfiles/Hyper
