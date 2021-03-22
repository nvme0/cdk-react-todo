import React from "react";
import { FormControl, FormLabel, TextField, TextFieldProps } from "@material-ui/core";
import { useField } from "formik";

export interface Props extends Omit<TextFieldProps, "name"> {
  name: string;
}

const FormikTextField = ({ label, name, helperText, fullWidth, multiline, ...props }: Props) => {
  const [field, meta] = useField(name);
  const validationError = meta.touched && Boolean(meta.error);
  return (
    <FormControl error={validationError} fullWidth={fullWidth}>
      <FormLabel>{label}</FormLabel>
      <TextField
        error={meta.touched && Boolean(meta.error)}
        helperText={meta.touched && Boolean(meta.error) ? meta.error : helperText}
        multiline={multiline}
        {...field}
        {...props}
      />
    </FormControl>
  );
};

export default FormikTextField;
