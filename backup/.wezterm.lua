-- Imports
local wezterm = require 'wezterm'
local mux = wezterm.mux
local act = wezterm.action
local gpus = wezterm.gui.enumerate_gpus()

-- Build the default config
local config = wezterm.config_builder()

-- Event Handlers
wezterm.on('update-right-status', function(window, pane)
    -- Format: Battery + Date/Time
    local date = wezterm.strftime '%a %b %-d %H:%M '

    -- Battery status
    local bat_text = ''
    for _, b in ipairs(wezterm.battery_info()) do
        bat_text = string.format('🔋 %.0f%%', b.state_of_charge * 100)
    end

    -- Combined status
    window:set_right_status(wezterm.format {{
        Text = bat_text .. '   ' .. date
    }})
end)

-- GPU Selection
config.webgpu_preferred_adapter = gpus[2]

-- Rendering & Performance
config.front_end = 'OpenGL'
config.prefer_egl = true
config.max_fps = 144
config.animation_fps = 144
config.default_cursor_style = 'BlinkingBlock'
config.cursor_blink_rate = 1024
config.term = 'xterm-256color'

-- Appearance
-- Font
config.font = wezterm.font {
    family = 'JetBrains Mono',
    stretch = 'Expanded',
    weight = 'DemiBold'
}
config.font_size = 12
config.cell_width = 0.9

-- Color schemes (apply in order; last one wins)
config.color_scheme = 'Argonaut'
config.color_scheme = 'Aardvark Blue'
config.color_scheme = 'Aci (Gogh)'

-- Colors: cursor styling
config.colors = {
    cursor_bg = '#52ad70',
    cursor_fg = '#ffffff'
}

-- ## 7. Window Frame & Decorations
config.window_decorations = 'INTEGRATED_BUTTONS | RESIZE'
config.window_background_opacity = 0.85
config.window_padding = {
    left = 10,
    right = 10,
    top = 10,
    bottom = 10
}
config.window_frame = {
    inactive_titlebar_bg = '#353535',
    active_titlebar_bg = '#2b2042',
    inactive_titlebar_fg = '#cccccc',
    active_titlebar_fg = '#ffffff',
    button_fg = '#cccccc',
    button_bg = '#2b2042',
    button_hover_fg = '#ffffff',
    button_hover_bg = '#3b3052',
    border_left_width = '0cell',
    border_right_width = '0cell',
    border_bottom_height = '0cell',
    border_left_color = 'purple',
    border_right_color = 'purple',
    border_bottom_color = 'purple',
    border_top_color = 'purple',

    font_size = 11,
    font = wezterm.font('JetBrains Mono', {
        weight = 'DemiBold'
    })
}

-- ## 8. Tab Bar
config.hide_tab_bar_if_only_one_tab = false
config.use_fancy_tab_bar = false
config.tab_bar_at_bottom = true
config.show_tabs_in_tab_bar = true
config.show_new_tab_button_in_tab_bar = true
config.prefer_to_spawn_tabs = true

-- Tab bar styling to match theme
config.colors.tab_bar = {
    background = '#011627',
    active_tab = {
        bg_color = '#011627',
        fg_color = '#CEFDFF'
    },
    inactive_tab = {
        bg_color = '#222831',
        fg_color = '#948979'
    },
    inactive_tab_hover = {
        bg_color = '#3b3052',
        fg_color = '#cccccc'
    },
    new_tab = {
        bg_color = '#011627',
        fg_color = '#CEFDFF'
    },
    new_tab_hover = {
        bg_color = '#DFD0B8',
        fg_color = '#222831'
    }
}

-- ## 9. Pane Appearance
config.inactive_pane_hsb = {
    saturation = 0.0,
    brightness = 1.0
}

-- ## 10. Default Shell (Cross-Platform)
if wezterm.target_triple:find('windows') then
    config.default_prog = {'powershell.exe', '-NoLogo'}
else
    local shell = os.getenv('SHELL') or '/bin/bash'
    if shell:match('zsh$') then
        config.default_prog = {'zsh', '-l'}
    else
        config.default_prog = {'bash', '-l'}
    end
end

-- ## 11. Window Size
config.initial_cols = 121
config.initial_rows = 31
wezterm.on("gui-startup", function(cmd)
    -- spawn your normal window/tabs/panes…
    mux.spawn_window(cmd or {})
    -- Window centering logic removed due to unavailable APIs
end)

-- ## 12. Return config
return config
