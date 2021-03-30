import React from "react";
import { hot } from "react-hot-loader/root";
import Amplify from "aws-amplify";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { QueryClient, QueryClientProvider } from "react-query";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { SnackbarUtilsConfigurator } from "@app/utils/SnackbarUtils";
import theme from "@app/theme";
import Todos from "@app/components/Todos";
import awsExports from "@app/awsExports";

import "./styles.scss";

Amplify.configure(awsExports);
const queryClient = new QueryClient();

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3} dense>
        <SnackbarUtilsConfigurator />
        <QueryClientProvider client={queryClient}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <AmplifySignOut />
            <Todos />
          </MuiPickersUtilsProvider>
        </QueryClientProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default hot(withAuthenticator(App));
