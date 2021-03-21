import React from "react";
import { Card, CardHeader, CardContent } from "@material-ui/core";
import { DragDropContext, Droppable, DropResult, ResponderProvided } from "react-beautiful-dnd";
import { useQuery, useMutation, useQueryClient } from "react-query";

import useStyles from "./styles";
import { Todo } from "@app/Types/Todo";
import { TODOS_QUERY_KEY } from "@app/constants";
import wrapAsyncWithToastr from "@app/utils/wrapAsyncWithToastr";
import SnackbarUtils from "@app/utils/SnackbarUtils";
import listTodos from "@app/api/todos/list";
import upsertTodo from "@app/api/todos/upsertTodo";
import TodoList from "@app/components/TodoList";
import CircularProgressCentered from "@app/components/CircularProgressCentered";

const Todos = () => {
  const classes = useStyles();
  const queryClient = useQueryClient();

  const { mutate } = useMutation((todo: Omit<Todo, "id"> & { id?: string }) => upsertTodo({ todo }), {
    onMutate: async (todo) => {
      await queryClient.cancelQueries(TODOS_QUERY_KEY);

      const previousValue = queryClient.getQueryData<Todo[]>(TODOS_QUERY_KEY);
      if (!previousValue) return [];

      const index = previousValue.findIndex(({ id }) => id === todo.id);

      if (index > -1) {
        queryClient.setQueryData<Todo[]>(TODOS_QUERY_KEY, (old) => {
          if (!old) return [];
          return old
            .map((entry) => {
              if (entry.id === todo.id) return todo as Todo;
              else return entry;
            })
            .sort((a, b) => a.place - b.place);
        });
      } else {
        queryClient.setQueryData<Todo[]>(TODOS_QUERY_KEY, (old) => {
          if (!old) return [];
          if (!todo.clientId) return old;
          const newTodo: Todo = { ...todo, id: todo.clientId };
          return [...old, newTodo].sort((a, b) => a.place - b.place);
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
          return old
            .map((entry) => {
              if (entry.id === clientId) return todo;
              else return entry;
            })
            .sort((a, b) => a.place - b.place);
        });
      }
      queryClient.invalidateQueries(TODOS_QUERY_KEY);
    },
  });

  const { isLoading, data } = useQuery({
    queryKey: TODOS_QUERY_KEY,
    queryFn: () => wrapAsyncWithToastr(() => listTodos(), { successMessage: "Loaded Todos" }),
  });
  const todos = (data || []) as Todo[];

  const handleOnDragEnd = (result: DropResult, provided: ResponderProvided) => {
    if (!result.destination) return;
    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({ ...item, place: index }));

    const changedItems = updatedItems.filter((item) => {
      const referenceItem = todos.find(({ id }) => id === item.id);
      if (!referenceItem) return false;
      if (referenceItem.place !== item.place) return true;
      return false;
    });

    // TODO batch update
    changedItems.forEach((item) => {
      mutate(item);
    });
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        title="CDK React TODOs"
        titleTypographyProps={{
          component: "h1",
          variant: "h4",
        }}
      />
      <CardContent>
        {isLoading ? (
          <CircularProgressCentered message="Loading..." />
        ) : (
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId={TODOS_QUERY_KEY}>
              {(provided) => <TodoList provided={provided} todos={todos} />}
            </Droppable>
          </DragDropContext>
        )}
      </CardContent>
    </Card>
  );
};

export default Todos;
