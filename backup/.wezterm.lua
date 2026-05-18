-- Imports
local wezterm = require 'wezterm'
local mux = wezterm.mux
local act = wezterm.action
local gpus = wezterm.gui.enumerate_gpus()
local io = require 'io'
local os = require 'os'

-- StartUp Tasks
wezterm.on('gui-startup', function(cmd)
    -- Get Info
    -- local log_path = os.getenv('USERPROFILE') .. '\\wezterm-startup.log'
    -- local f = io.open(log_path, 'a')
    -- if f then
    --     f:write('WezTerm started at: ' .. os.date() .. '\n')
    --     f:close()
    -- end

    -- Window Positioning
    local tab, pane, window = wezterm.mux.spawn_window(cmd or {})
    window:gui_window():set_position(240, 14)
end)

-- Build the default config
local config = wezterm.config_builder()

-- ## 11. Window Size
config.initial_cols = 129
config.initial_rows = 35

-- Event Handlers
wezterm.on('update-right-status', function(window, pane)
    -- Format: Battery + Date/Time
    local date = wezterm.strftime '%a, %b %-d %H:%M %p'

    -- Battery status
    local bat_text = ''
    for _, b in ipairs(wezterm.battery_info()) do
        bat_text = string.format(' 🔋%.0f%%', b.state_of_charge * 100)
    end

    -- Combined status
    window:set_right_status(wezterm.format {
        {Background = {Color = '#011627'}},
        {Foreground = {Color = '#7f8f9f'}},
        {Text = ' '},
        {Foreground = {Color = '#c792ea'}},
        {Text = bat_text ~= '' and bat_text or ' AC'},
        {Foreground = {Color = '#7f8f9f'}},
        {Text = '  |  '},
        {Foreground = {Color = '#82aaff'}},
        {Text = date},
        {Foreground = {Color = '#7f8f9f'}},
        {Text = ' '}
    })
end)

-- GPU Selection
config.webgpu_preferred_adapter = gpus[1] --> Vulkan Driver is Recommended

-- Rendering & Performance
-- config.front_end = 'WebGpu' --> Activates dGPU
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
    weight = 'Medium'
}
config.font_size = 12
config.cell_width = 0.9

-- Color scheme
config.color_scheme = 'Night Owl (Gogh)'

-- Colors: cursor styling
config.colors = {
    cursor_bg = '#80a4c2',
    cursor_fg = '#011627'
}

-- ## 7. Window Frame & Decorations
-- config.win32_system_backdrop = 'Acrylic'
config.window_decorations = 'INTEGRATED_BUTTONS | RESIZE'
-- config.text_background_opacity = 0.9
config.window_background_opacity = 0.8
config.window_padding = {
    left = 10,
    right = 10,
    top = 10,
    bottom = 10
}
config.window_frame = {
    inactive_titlebar_bg = '#011627',
    active_titlebar_bg = '#011627',
    inactive_titlebar_fg = '#7f8f9f',
    active_titlebar_fg = '#d6deeb',
    button_fg = '#7f8f9f',
    button_bg = '#011627',
    button_hover_fg = '#d6deeb',
    button_hover_bg = '#0b2942',
    border_left_width = '0cell',
    border_right_width = '0cell',
    border_bottom_height = '0cell',
    border_left_color = '#011627',
    border_right_color = '#011627',
    border_bottom_color = '#011627',
    border_top_color = '#011627',

    font_size = 11,
    font = wezterm.font('JetBrains Mono', {
        weight = 'Regular'
    })
}

-- ## 8. Tab Bar
config.tab_and_split_indices_are_zero_based = false
config.hide_tab_bar_if_only_one_tab = false
config.use_fancy_tab_bar = true
config.tab_bar_at_bottom = false
config.show_tabs_in_tab_bar = true
config.show_new_tab_button_in_tab_bar = true
config.prefer_to_spawn_tabs = true

-- Tab bar styling to match theme
config.colors.tab_bar = {

    active_tab = {
        bg_color = '#0b2942',
        fg_color = '#d6deeb'
    },
    inactive_tab = {
        bg_color = '#011627',
        fg_color = '#7f8f9f'
    },
    inactive_tab_hover = {
        bg_color = '#13344f',
        fg_color = '#d6deeb'
    },
    new_tab = {
        bg_color = '#011627',
        fg_color = '#82aaff'
    },
    new_tab_hover = {
        bg_color = '#13344f',
        fg_color = '#d6deeb'
    }
}

-- ## 9. Pane Appearance
config.inactive_pane_hsb = {
    saturation = 0.0,
    brightness = 1.0
}

-- ## 10. Default Shell (Cross-Platform)
if wezterm.target_triple:find('windows') then
    -- config.default_prog = {'pwsh.exe', '-NoLogo'}
    config.default_prog = {'bash.exe', '-nologin'}
else
    local shell = os.getenv('SHELL') or '/bin/bash'
    if shell:match('zsh$') then
        config.default_prog = {'zsh', '-l'}
    else
        config.default_prog = {'bash', '-l'}
    end
end

-- ## 12. Miscellanous
config.audible_bell = "Disabled"

-- ## 13. Return config
return config
