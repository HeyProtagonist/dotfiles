"use strict";

module.exports = {
  config: {
    updateChannel: "stable",
    fontSize: 15,
    fontFamily: '"JetBrains Mono", monospace',
    fontWeight: "normal",
    fontWeightBold: "bold",
    lineHeight: 1.3,
    letterSpacing: 0,
    cursorColor: "rgba(248,28,229,0.8)",
    cursorAccentColor: "#000",
    cursorShape: "BLOCK",
    cursorBlink: true,
    foregroundColor: "#fff",
    backgroundColor: "#000",
    selectionColor: "rgba(248,28,229,0.3)",
    borderColor: "#444", // Thin hyper border
    css: /*css*/ `
        * {
        font-family: "JetBrains Mono", monospace !important;
      }

      .tabs_nav {
        top: 0px;
      }

      .tabs_nav .tabs_title {
        font-family: "JetBrains Mono", monospace !important;
      }

      .terms_termsShifted {
        margin-top: 34px;
      }

      .terms_termsNotShifted {
        margin-top: 8px;
      }

      .header_header > div {
        display: none !important;
      }

      .line {
        font-family: "JetBrains Mono", monospace !important;
        padding: 1rem 0.4rem;
        font-size: 12px;
        font-weight: 400;
      }
    `,
    termCSS: "",
    workingDirectory: "D:\\Workspace",
    showHamburgerMenu: false,
    showWindowControls: false,
    padding: "12px 14px",
    colors: {
      black: "#000000",
      red: "#C51E14",
      green: "#1DC121",
      yellow: "#C7C329",
      blue: "#0A2FC4",
      magenta: "#C839C5",
      cyan: "#20C5C6",
      white: "#C7C7C7",
      lightBlack: "#686868",
      lightRed: "#FD6F6B",
      lightGreen: "#67F86F",
      lightYellow: "#FFFA72",
      lightBlue: "#6A76FB",
      lightMagenta: "#FD7CFC",
      lightCyan: "#68FDFE",
      lightWhite: "#FFFFFF",
      limeGreen: "#32CD32",
      lightCoral: "#F08080",
    },
    shell: "C:\\msys64\\usr\\bin\\zsh.exe",
    shellArgs: ["--login", "-i"],
    env: {},
    bell: false,
    copyOnSelect: true,
    defaultSSHApp: true,
    quickEdit: true,
    macOptionSelectionMode: "vertical",
    webGLRenderer: true,
    webLinksActivationKey: "",
    disableLigatures: false,
    disableAutoUpdates: false,
    screenReaderMode: false,
    preserveCWD: true,
    hyperline: {
      plugins: ["hostname", "ip", /* "memory", "cpu", "network", */ "battery"],
    },
  },
  plugins: [
    "hyper-night-owl",
    "hyper-font-ligatures",
    "hyperpower",
    "hyperborder",
    "hyper-tab-icons",
    "hyper-alt-click",
    "hyperlinks",
    "git-falcon9",
    "hyperline",
    "hyper-rename-tab",
  ],
  localPlugins: [],
  keymaps: {},
};
