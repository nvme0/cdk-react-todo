import { makeStyles, useTheme } from "@material-ui/core/styles";

const styles = makeStyles((theme) => ({
  root: {
    height: "100%",
    position: "relative",
    margin: theme.spacing(2),
  },
}));

const useStyles = () => {
  const theme = useTheme();
  return styles(theme);
};

export default useStyles;
