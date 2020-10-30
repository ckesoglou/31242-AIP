import React from "react";
import ReactDOM from "react-dom";
import "./assets/css/index.css";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import { ThemeProvider, CssBaseline } from "@material-ui/core";
import theme from "./components/theme";
import { makeServer } from "./components/server";

makeServer();

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
