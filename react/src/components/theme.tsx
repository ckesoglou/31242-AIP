import { red } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";

enum Theme {
  light,
  dark,
  mint,
  apple,
  blue,
}

// set current theme
let currentTheme = Theme.apple;

function colorType(): "light" | "dark" {
  switch (currentTheme) {
    case Theme.light:
      return "light";
    case Theme.dark:
    case Theme.mint:
    case Theme.apple:
    case Theme.blue:
      return "dark";
    default:
      return "light";
  }
}
function primaryColor(): string {
  switch (currentTheme) {
    case Theme.light:
      return "#556cd6";
    case Theme.dark:
      return "#BB86FC";
    case Theme.mint:
      return "#3BBA9C";
    case Theme.apple:
      return "#86C232";
    case Theme.blue:
      return "#2970ff";
    default:
      return "#556cd6";
  }
}
function secondaryColor(): string {
  switch (currentTheme) {
    case Theme.light:
      return "#19857b";
    case Theme.dark:
      return "#03DAC5";
    case Theme.mint:
      return "#707793";
    case Theme.apple:
      return "#707793";
    case Theme.blue:
      return "#2dd8a3";
    default:
      return "#19857b";
  }
}
function backgroundColor(): string {
  switch (currentTheme) {
    case Theme.light:
      return "#fff";
    case Theme.dark:
      return "#121212";
    case Theme.mint:
      return "#2E3047";
    case Theme.apple:
      return "#222629";
    case Theme.blue:
      return "#152042";
    default:
      return "#fff";
  }
}

const theme = createMuiTheme({
  palette: {
    type: colorType(),
    primary: {
      main: primaryColor(),
    },
    secondary: {
      main: secondaryColor(),
    },
    error: {
      main: red.A400,
    },
    background: {
      default: backgroundColor(),
    },
  },
  typography: {
    fontFamily: [
      'Poppins',
      'Roboto',
      'sans-serif'
    ].join(','),
  }
});

export default theme;
