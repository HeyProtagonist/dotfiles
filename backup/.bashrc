SEP="\[\e[36m\] • "
CURRENT_USERNAME="\[\e[32m\]\u@"

parse_git_branch() {
  branch=$(git branch --show-current 2>/dev/null)

  if [ -n "$branch" ]; then
    echo "${SEP}\[\e[33m\][git: $branch]\[\e[0m\]"
  fi
}

set_prompt(){
  PS1="\h${SEP}\[\e[34m\]\W$(parse_git_branch)\n\$ "
}

PROMPT_COMMAND=set_prompt

# Functions
watch () {
  local interval=1
  local command_to_run=""

  # Parse -n argument for interval (e.g., watch -n 5 ls)
  if [[ "$1" == "-n" && "$2" =~ ^[0-9]+(\.[0-9]+)?$ ]]; then
    interval="$2"
    shift 2
  fi

  command_to_run="${@}"
  
  if [ -z "$command_to_run" ]; then
    echo "Usage: watch [-n <seconds>] <command>"
    return 1
  fi

  clear
  while true; do
    OUTPUT="$(eval "$command_to_run" 2>&1)"
    clear
    echo -e " Every ${interval} s: $command_to_run "
    echo " "
    echo -e "${OUTPUT}"
    sleep "$interval"
  done
}   

# Aliases
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

# Load Angular CLI autocompletion.
source <(ng completion script)
