import { TODO_API_URL } from "@app/constants";
import { Todo } from "@app/Types/Todo";

const list = async (): Promise<Todo[]> => {
  const fetchOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  };

  const response = await fetch(TODO_API_URL, fetchOptions);
  const { todos }: { todos: Todo[] } = await response.json();
  return todos;
};

export default list;
