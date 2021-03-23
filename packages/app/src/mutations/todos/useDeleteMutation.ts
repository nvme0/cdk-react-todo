import { useMutation, useQueryClient } from "react-query";

import { Todo } from "@app/Types/Todo";
import { TODOS_QUERY_KEY } from "@app/constants";
import SnackbarUtils from "@app/utils/SnackbarUtils";
import deleteTodo, { DeleteOneProps } from "@app/api/todos/deleteOne";

const useDeleteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((props: DeleteOneProps) => deleteTodo(props), {
    onMutate: async (props) => {
      await queryClient.cancelQueries(TODOS_QUERY_KEY);

      const previousValue = queryClient.getQueryData<Todo[]>(TODOS_QUERY_KEY);
      if (!previousValue) return [];

      const index = previousValue.findIndex(({ id }) => id === props.id);

      if (index > -1) {
        queryClient.setQueryData<Todo[]>(TODOS_QUERY_KEY, (old) => {
          if (!old) return [];
          return old.filter((entry) => {
            if (entry.id === props.id) return false;
            else return true;
          });
        });
      }

      return previousValue;
    },
    onError: (e: Error, _variables, previousValue) => {
      SnackbarUtils.error(e?.message ? e.message : "An unknown Error has occured");
      queryClient.setQueryData(TODOS_QUERY_KEY, previousValue);
      queryClient.invalidateQueries(TODOS_QUERY_KEY);
    },
    onSuccess: () => {
      SnackbarUtils.success("Todo deleted");
      queryClient.invalidateQueries(TODOS_QUERY_KEY);
    },
  });
};

export default useDeleteMutation;
