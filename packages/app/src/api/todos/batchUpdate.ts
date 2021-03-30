import { API_URL } from "@app/constants";
import { Todo } from "@app/Types/Todo";
import getAuthToken from "@app/utils/getAuthToken";

export interface BatchUpdateProps {
  todos: Todo[];
}

const batchUpdate = async ({ todos }: BatchUpdateProps) => {
  if (!todos.length) return todos;

  const token = await getAuthToken();
  const fetchOptions: RequestInit = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: token,
    },
    body: JSON.stringify({ todos }),
  };

  await fetch(`${API_URL}/todos`, fetchOptions);
  return todos;
};

export default batchUpdate;
