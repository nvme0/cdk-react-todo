import { makeStyles, useTheme } from "@material-ui/core/styles";

const NUM_COLUMNS = 3;

const styles = makeStyles((theme) => ({
  root: {
    height: "100%",
    position: "relative",
    margin: theme.spacing(2),
    minWidth: (theme.breakpoints.values.lg - theme.spacing(2) * (NUM_COLUMNS + 1)) / 3,
  },
  header: {},
  columns: {
    height: "100%",
    width: "100%",
    padding: theme.spacing(2, 1),
    margin: 0,
    minWidth: theme.breakpoints.values.lg,
  },
}));

const useStyles = () => {
  const theme = useTheme();
  return styles(theme);
};

export default useStyles;
