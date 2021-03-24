import { Todo, TodoMap } from "@app/Types/Todo";

const createTodoMap = (todos: Todo[]) => {
  return todos.reduce<TodoMap>(
    (todoMap: TodoMap, todo: Todo) => ({
      ...todoMap,
      [todo.stage]: [...todoMap[todo.stage], todo],
    }),
    {
      TODO: [],
      DOING: [],
      DONE: [],
    },
  );
};

export default createTodoMap;
