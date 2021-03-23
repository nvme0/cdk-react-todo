import { Theme, createMuiTheme } from "@material-ui/core/styles";

// based off https://uxdesign.cc/refining-a-color-palette-for-dark-mode-1a8bb78e7338
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#008ab0",
    },
    secondary: {
      main: "#c47062",
    },
    type: "dark",
    background: {
      default: "#0d1e24",
      paper: "#0d262f",
    },
  },
});

export default {
  ...theme,
  overrides: {
    MuiDialogActions: {
      root: {
        padding: theme.spacing(2, 3),
      },
    },
    MuiCardHeader: {
      action: {
        marginTop: 0,
        marginRight: 0,
      },
    },
  },
} as Theme;
