import { red } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#fff",
    },
  },
});

const themeDark = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#BB86FC",
    },
    secondary: {
      main: "#03DAC5",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#121212",
    },
  },
});

const themeApple = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#86C232",
    },
    secondary: {
      main: "#707793",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#222629",
    },
  },
});

const themeMint = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#3BBA9C",
    },
    secondary: {
      main: "#707793",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#2E3047",
    },
  },
});

const themeBlue = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#2970ff",
    },
    secondary: {
      main: "#2dd8a3",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#152042",
    },
  },
});

export default themeMint;
