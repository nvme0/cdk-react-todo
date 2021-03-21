import { useMutation, useQueryClient } from "react-query";

import { Todo } from "@app/Types/Todo";
import { TODOS_QUERY_KEY } from "@app/constants";
import SnackbarUtils from "@app/utils/SnackbarUtils";
import batchUpdateTodo from "@app/api/todos/batchUpdate";

export interface MutationProps {
  updatedTodos: Todo[];
  changedTodos: Todo[];
}

const useBatchUpdateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(({ changedTodos }: MutationProps) => batchUpdateTodo({ todos: changedTodos }), {
    onMutate: async ({ updatedTodos: todos }) => {
      await queryClient.cancelQueries(TODOS_QUERY_KEY);

      const previousValue = queryClient.getQueryData<Todo[]>(TODOS_QUERY_KEY);
      if (!previousValue) return [];

      queryClient.setQueryData<Todo[]>(TODOS_QUERY_KEY, (old) => {
        if (!old) return [];
        return todos;
      });

      return previousValue;
    },
    onError: (e: Error, _variables, previousValue) => {
      SnackbarUtils.error(e?.message ? e.message : "An unknown Error has occured");
      queryClient.setQueryData(TODOS_QUERY_KEY, previousValue);
      queryClient.invalidateQueries(TODOS_QUERY_KEY);
    },
    onSuccess: () => {
      SnackbarUtils.success("Todos Updated");
      queryClient.invalidateQueries(TODOS_QUERY_KEY);
    },
  });
};

export default useBatchUpdateMutation;
