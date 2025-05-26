-- Pull in the wezterm API
local wezterm = require 'wezterm'
local act = wezterm.action
-- local mux = wezterm.mux

-- This will hold the configuration.
local config = wezterm.config_builder()
config.front_end = "WebGpu"
local gpus = wezterm.gui.enumerate_gpus()
config.webgpu_preferred_adapter = gpus[1]
config.max_fps = 60
config.default_cursor_style = "BlinkingBlock"
config.animation_fps = 60
config.cursor_blink_rate = 500
config.term = "xterm-256color" -- Set the terminal type

-- This is where you actually apply your config choices
config.font = wezterm.font 'Dank Mono'
config.font = wezterm.font 'JetBrains Mono Regular'
config.font_size = 12
config.color_scheme = 'Argonaut'
config.color_scheme = 'Aardvark Blue'
config.color_scheme = 'Aci (Gogh)'
config.cell_width = 0.9
config.window_background_opacity = 0.96
config.prefer_egl = true

config.colors = {
    cursor_bg = '#52ad70', -- keep this or change to suit the theme
    cursor_fg = '#ffffff' -- make text under cursor visible!
    -- cursor_border = '#52ad70'
}

config.window_padding = {
    left = 10,
    right = 10,
    top = 10,
    bottom = 10
}

-- tabs
config.hide_tab_bar_if_only_one_tab = false
config.use_fancy_tab_bar = false
config.tab_bar_at_bottom = true

config.inactive_pane_hsb = {
    saturation = 0.0,
    brightness = 1.0
}

config.window_frame = {
    font = wezterm.font({
        family = "Jetbrains Mono",
        weight = "Regular"
    })

    -- active_titlebar_bg = "#0c0b0f"
}

config.window_decorations = "NONE | RESIZE"
config.initial_cols = 121
config.initial_rows = 31

-- config.window_background_image = "C:/dev/misc/berk.png"
-- config.window_background_image_hsb = {
-- 	brightness = 0.1,
-- }

-- Spawn a shell in login mode
-- config.default_prog = { "powershell.exe", "-NoLogo" }
config.default_prog = {"C:\\msys64\\msys2_shell.cmd", "-defterm", "-mingw64", "-no-start", "-use-full-path", "-here",
                       "-ucrt64", "-shell", "zsh"}

-- and finally, return the configuration to wezterm
return config
