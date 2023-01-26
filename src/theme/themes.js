import { createTheme } from "@mui/material/styles";

const themeDark = createTheme({
  palette: {
    background: {
      default: "#222",
      paper: "#333",
    },
    text: {
      primary: "#FFF",
      disabled: "#FFF",
      secondary: "#FFF",
    },
    primary: {
      main: "#FFF",
      contrastText: "#000",
    },
    secondary: {
      main: "#03DAC6",
      contrastText: "#000",
    },
    error: {
      main: "#CF6679",
    },
  },
  typography: {
    fontSize: 16,
    h3: {
      fontWeight: 700,
      fontSize: "2.2rem",
    },
    h4: {
      fontWeight: 700,
      fontSize: "1.75rem",
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
});

export default themeDark;
