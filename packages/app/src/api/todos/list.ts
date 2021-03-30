import { API_URL } from "@app/constants";
import { Todo } from "@app/Types/Todo";
import getAuthToken from "@app/utils/getAuthToken";

const list = async (): Promise<Todo[]> => {
  const token = await getAuthToken();
  const fetchOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: token,
    },
  };

  const response = await fetch(`${API_URL}/todos`, fetchOptions);
  const { todos }: { todos: Todo[] } = await response.json();
  return todos;
};

export default list;
