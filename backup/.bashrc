# General Settings
alias ls="ls -lAFh"            # List files with detailed info and human-readable sizes
alias ll="ls -l"               # Shortcut for 'ls -l'
alias la="ls -A"               # List all files including hidden files
alias l="ls -CF"               # List files with classifying indicators
alias grep="grep --color=auto" # Highlight search results
alias src="source ~/.bashrc"   # Reload bash configuration
alias ipme='curl api64.ipify.org'

# NVM Scripts
alias install-nvm="curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash"

# Disk Usage
alias df="df -h"  # Disk space usage in human-readable format
alias du="du -sh" # Disk usage of files and directories

# Network
alias ports="netstat -tuln" # List all listening ports

# System Information
alias cpu="lscpu"        # Display CPU architecture info
alias mem="free -h"      # Display memory usage in human-readable format
alias uptime="uptime -p" # Display system uptime
