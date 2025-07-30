" Vim Plugins for `vim-plug`
call plug#begin()

Plug 'tpope/vim-sensible'
Plug 'haishanh/night-owl.vim'

call plug#end()

" Enable relative line numbers
set relativenumber

" enable 24bit true color
"" If you have vim >=8.0 or Neovim >= 0.1.5
if (has("termguicolors"))
    set termguicolors
endif

" Enable syntax highlighting
syntax enable

" Set color scheme to a Night Owl friendly theme
colorscheme night-owl

" Enable line numbers
set number

" Highlight current line
set cursorline

" Enable mouse support
set mouse=a

" Enable auto-completion menu
set completeopt=menuone,noinsert,noselect

" Enable incremental search
set incsearch

" Highlight search results
set hlsearch

" Ignore case in search patterns
set ignorecase

" Override ignorecase if search pattern contains uppercase letters
set smartcase

" Set tab width to 4 spaces
set tabstop=4
set shiftwidth=4
set expandtab

" Enable line wrapping
set wrap

" Show matching parentheses
set showmatch

" Enable persistent undo
" set undofile

" Set status line
set laststatus=2

" Minimalistic status line
set statusline=%f\ %y\ %m\ %r\ %=

" Enable file type detection
filetype plugin indent on

" Set leader key to space
let mapleader=" "

" Key mappings for better navigation
nnoremap <leader>w :w<CR>
nnoremap <leader>q :q<CR>
nnoremap <leader>h :nohlsearch<CR>

