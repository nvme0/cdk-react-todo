import { API_URL } from "@app/constants";
import { Todo } from "@app/Types/Todo";

export interface BatchUpdateProps {
  todos: Todo[];
}

const batchUpdate = async ({ todos }: BatchUpdateProps) => {
  if (!todos.length) return todos;
  const fetchOptions: RequestInit = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({ todos }),
  };

  await fetch(`${API_URL}/todos`, fetchOptions);
  return todos;
};

export default batchUpdate;
