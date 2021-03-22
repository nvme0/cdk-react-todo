import React from "react";
import { merge } from "lodash";
import { FormikProvider, useFormik } from "formik";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextFieldProps,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";

import useStyles from "./styles";
import validationSchema, { getDefaultValues } from "./schema";
import FormikTextField from "@app/components/Formik/TextField";
import { Todo } from "@app/Types/Todo";
import useUpsertMutation from "@app/mutations/todos/useUpsertMutation";

export interface Props {
  todo: Partial<Todo>;
  closeModal: () => void;
}

export const TodoModal = ({ todo, closeModal }: Props) => {
  const theme = useTheme();
  const classes = useStyles();
  const { mutate: upsertTodo } = useUpsertMutation();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isEditing = Boolean(todo.id);

  const formik = useFormik<Omit<Todo, "id"> & { id?: string }>({
    initialValues: merge({}, getDefaultValues(todo.id), todo),
    validationSchema,
    enableReinitialize: true,
    onSubmit: (data) => {
      upsertTodo(data);
      closeModal();
    },
  });
  const { getFieldProps, submitForm } = formik;

  const textFieldProps: TextFieldProps = {
    fullWidth: true,
  };

  return (
    <Dialog open={true} onClose={closeModal} fullScreen={fullScreen} maxWidth="lg">
      <DialogTitle className={classes.modalTitle} disableTypography>
        <Typography variant="h5" component="h2">
          {isEditing ? "Edit" : "Add"} Todd
        </Typography>
        <IconButton onClick={closeModal}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <FormikProvider value={formik}>
          <form noValidate autoComplete="off">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormikTextField
                  label="Title"
                  variant="standard"
                  rows={1}
                  rowsMax={6}
                  {...textFieldProps}
                  {...getFieldProps("title")}
                />
              </Grid>
              <Grid item xs={12}>
                <FormikTextField
                  label="Description"
                  variant="outlined"
                  multiline
                  rows={1}
                  rowsMax={6}
                  {...textFieldProps}
                  {...getFieldProps("description")}
                />
              </Grid>
            </Grid>
          </form>
        </FormikProvider>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={closeModal} variant="text" color="primary">
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary" onClick={submitForm}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TodoModal;
