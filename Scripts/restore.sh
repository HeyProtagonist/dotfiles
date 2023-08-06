#!/bin/bash

# Restore VIM `.vimrc`
# Logic goes here...

# Restore VSCode `settings.json`, `keybindings.json`
cp -r $HOME/.dotfiles/VSCode/settings.json $HOME/AppData/Roaming/Code/User/
cp -r $HOME/.dotfiles/VSCode/keybindings.json $HOME/AppData/Roaming/Code/User/

# Restore VSCode `extensions`
extensions_file="$HOME/.dotfiles/VSCode/extensions"

for extension_id in $(cat "$extensions_file"); do
    code --install-extension $extension_id
done

# Restore Hyper Terminal `.hyper.js`
cp -r $HOME/.dotfiles/Hyper/.hyper.js $HOME/AppData/Roaming/Hyper/
