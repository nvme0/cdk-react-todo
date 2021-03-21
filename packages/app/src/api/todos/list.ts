import { API_URL } from "@app/constants";
import { Todo } from "@app/Types/Todo";

const list = async (): Promise<Todo[]> => {
  const fetchOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  };

  const response = await fetch(`${API_URL}/todos`, fetchOptions);
  const { todos }: { todos: Todo[] } = await response.json();
  return todos.sort((a, b) => a.place - b.place);
};

export default list;
