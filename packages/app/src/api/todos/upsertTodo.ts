import { API_URL } from "@app/constants";
import { Todo } from "@app/Types/Todo";

interface CreateProps {
  data: Omit<Todo, "id">;
}

const createOne = async ({ data }: CreateProps) => {
  const fetchOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(`${API_URL}/todos`, fetchOptions);
  const { todo }: { todo: Todo } = await response.json();
  return todo;
};

interface UpdateProps {
  id: string;
  data: Omit<Todo, "id">;
}

const updateOne = async ({ id, data }: UpdateProps): Promise<Todo> => {
  const fetchOptions: RequestInit = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(data),
  };

  await fetch(`${API_URL}/todo/${id}`, fetchOptions);
  return { id, ...data };
};

export interface UpsertProps {
  todo: Omit<Todo, "id"> & { id?: string };
}

const upsertOne = async ({ todo: { id, ...data } }: UpsertProps): Promise<Todo> => {
  if (id) return updateOne({ id, data });
  else return createOne({ data });
};

export default upsertOne;
