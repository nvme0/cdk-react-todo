import React from "react";
import { hot } from "react-hot-loader/root";
import { QueryClient, QueryClientProvider } from "react-query";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { SnackbarUtilsConfigurator } from "@app/utils/SnackbarUtils";
import theme from "@app/theme";

import "./styles.scss";

const queryClient = new QueryClient();

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3} dense>
        <SnackbarUtilsConfigurator />
        <QueryClientProvider client={queryClient}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <div>Hello, World!</div>
          </MuiPickersUtilsProvider>
        </QueryClientProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default hot(App);
