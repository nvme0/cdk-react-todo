import { makeStyles, useTheme } from "@material-ui/core/styles";

const styles = makeStyles((theme) => ({
  modalTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

const useStyles = () => {
  const theme = useTheme();
  return styles(theme);
};

export default useStyles;
