import React, { useState } from "react";
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
import { Close as CloseIcon, Save as SaveIcon, Delete as DeleteIcon } from "@material-ui/icons";

import useStyles from "./styles";
import validationSchema, { getDefaultValues } from "./schema";
import FormikTextField from "@app/components/Formik/TextField";
import { Todo } from "@app/Types/Todo";
import useUpsertMutation from "@app/mutations/todos/useUpsertMutation";
import useDeleteMutation from "@app/mutations/todos/useDeleteMutation";
import ConfirmModal from "../ConfirmModal";

export interface Props {
  todo: Partial<Todo>;
  lastPlace: number;
  closeModal: () => void;
}

export const TodoModal = ({ todo, lastPlace, closeModal }: Props) => {
  const theme = useTheme();
  const classes = useStyles();
  const [showTodoModal, setShowTodoModal] = useState(false);
  const { mutate: upsertTodo } = useUpsertMutation();
  const { mutate: deleteTodo } = useDeleteMutation();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isEditing = Boolean(todo.id);

  const formik = useFormik<Omit<Todo, "id"> & { id?: string }>({
    initialValues: merge({}, getDefaultValues(lastPlace, todo.id), todo),
    validationSchema,
    onSubmit: (data) => {
      upsertTodo(data);
      closeModal();
    },
  });
  const { getFieldProps, submitForm } = formik;

  const textFieldProps: TextFieldProps = {
    fullWidth: true,
  };

  const openTodoModal = () => {
    setShowTodoModal(true);
  };

  const closeTodoModal = () => {
    setShowTodoModal(false);
  };

  const handleDeleteTodo = () => {
    const { id, clientId } = todo;
    if (id) {
      deleteTodo({ id, clientId });
    }
    closeModal();
  };

  return (
    <>
      <Dialog open={true} onClose={closeModal} fullScreen={fullScreen} maxWidth="lg">
        <DialogTitle className={classes.modalTitle} disableTypography>
          <Typography variant="h5" component="h2">
            {isEditing ? "Edit" : "Add"} TODO
          </Typography>
          <IconButton className={classes.closeButton} onClick={closeModal}>
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
        <DialogActions
          style={{
            justifyContent: isEditing ? "space-between" : undefined,
          }}
        >
          {isEditing && (
            <Button onClick={openTodoModal} variant="outlined" color="secondary" startIcon={<DeleteIcon />}>
              Delete
            </Button>
          )}
          <div className={classes.rightAlignedButtons}>
            <Button onClick={closeModal} variant="text" color="primary">
              Cancel
            </Button>
            <Button onClick={submitForm} type="submit" variant="contained" color="primary" startIcon={<SaveIcon />}>
              Save
            </Button>
          </div>
        </DialogActions>
      </Dialog>
      <ConfirmModal
        open={showTodoModal}
        title="Confirm delete TODO"
        onConfirm={handleDeleteTodo}
        onCancel={closeTodoModal}
      >
        <Typography variant="body1">Are you sure you want to delete this TODO?</Typography>
      </ConfirmModal>
    </>
  );
};

export default TodoModal;
