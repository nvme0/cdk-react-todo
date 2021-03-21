import { useMutation, useQueryClient } from "react-query";

import { Todo } from "@app/Types/Todo";
import { TODOS_QUERY_KEY } from "@app/constants";
import SnackbarUtils from "@app/utils/SnackbarUtils";
import upsertTodo from "@app/api/todos/upsert";

const useUpsertMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((todo: Omit<Todo, "id"> & { id?: string }) => upsertTodo({ todo }), {
    onMutate: async (todo) => {
      await queryClient.cancelQueries(TODOS_QUERY_KEY);

      const previousValue = queryClient.getQueryData<Todo[]>(TODOS_QUERY_KEY);
      if (!previousValue) return [];

      const index = previousValue.findIndex(({ id }) => id === todo.id);

      if (index > -1) {
        queryClient.setQueryData<Todo[]>(TODOS_QUERY_KEY, (old) => {
          if (!old) return [];
          return old.map((entry) => {
            if (entry.id === todo.id) return todo as Todo;
            else return entry;
          });
        });
      } else {
        queryClient.setQueryData<Todo[]>(TODOS_QUERY_KEY, (old) => {
          if (!old) return [];
          if (!todo.clientId) return old;
          const newTodo: Todo = { ...todo, id: todo.clientId };
          return [...old, newTodo];
        });
      }

      return previousValue;
    },
    onError: (e: Error, _variables, previousValue) => {
      SnackbarUtils.error(e?.message ? e.message : "An unknown Error has occured");
      queryClient.setQueryData(TODOS_QUERY_KEY, previousValue);
      queryClient.invalidateQueries(TODOS_QUERY_KEY);
    },
    onSuccess: ({ clientId, ...todo }, { id }) => {
      SnackbarUtils.success(id ? "Todo Updated" : "Todo Created");
      if (!id && clientId) {
        queryClient.setQueryData<Todo[]>(TODOS_QUERY_KEY, (old) => {
          if (!old) return [];
          return old.map((entry) => {
            if (entry.id === clientId) return todo;
            else return entry;
          });
        });
      }
      queryClient.invalidateQueries(TODOS_QUERY_KEY);
    },
  });
};

export default useUpsertMutation;
