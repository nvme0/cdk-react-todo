import * as yup from "yup";
import { v4 as uuid } from "uuid";
import { Todo } from "@app/Types/Todo";

const schema = yup.object().shape({
  id: yup.string(),
  clientId: yup.string(),
  title: yup.string().min(1).required("Required"),
  description: yup.string().min(1).required("Required"),
  stage: yup.string().min(1).required("Required"),
  place: yup.number().required("Required"),
});

export const getDefaultValues = (qtyInTodo: number, id?: string) => {
  const defaultValues: Omit<Todo, "id"> & { id?: string } = {
    title: "",
    description: "",
    stage: "TODO",
    place: qtyInTodo,
  };

  if (id) defaultValues.id = id;
  else defaultValues.clientId = uuid();
  return defaultValues;
};

export default schema;
