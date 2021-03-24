import React, { useState } from "react";
import { Card, CardHeader, CardContent, Button } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import { DragDropContext, Droppable, DropResult, ResponderProvided } from "react-beautiful-dnd";
import { useQuery } from "react-query";

import useStyles from "./styles";
import { Todo } from "@app/Types/Todo";
import { TODOS_QUERY_KEY } from "@app/constants";
import wrapAsyncWithToastr from "@app/utils/wrapAsyncWithToastr";
import listTodos from "@app/api/todos/list";
import TodoList from "@app/components/TodoList";
import TodoModal from "@app/components/TodoModal";
import CircularProgressCentered from "@app/components/CircularProgressCentered";
import useBatchUpdateMutation from "@app/mutations/todos/useBatchUpdateMutation";

const Todos = () => {
  const classes = useStyles();
  const { mutate: batchUpdateMutation } = useBatchUpdateMutation();
  const [selectedTodo, setSelectedTodo] = useState<Partial<Todo> | null>(null);

  const { isLoading, data } = useQuery({
    queryKey: TODOS_QUERY_KEY,
    queryFn: () => wrapAsyncWithToastr(() => listTodos(), { successMessage: "Loaded Todos" }),
  });
  const todos = (data || []) as Todo[];

  const computeLastPlace = () => {
    return todos[todos.length - 1].place;
  };

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

    batchUpdateMutation({
      updatedTodos: updatedItems,
      changedTodos: changedItems,
    });
  };

  const handleAddTodo = () => {
    setSelectedTodo({});
  };

  const handleClickTodo = (todo: Todo, index: number) => {
    setSelectedTodo(todo);
  };

  const handleCloseTodoModal = () => {
    setSelectedTodo(null);
  };

  return (
    <>
      <Card className={classes.root}>
        <CardHeader
          title="CDK React TODOs"
          titleTypographyProps={{
            component: "h1",
            variant: "h4",
          }}
          action={
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddTodo}>
              Add
            </Button>
          }
        />
        <CardContent>
          {isLoading ? (
            <CircularProgressCentered message="Loading..." />
          ) : (
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId={TODOS_QUERY_KEY}>
                {(provided) => <TodoList provided={provided} todos={todos} onClick={handleClickTodo} />}
              </Droppable>
            </DragDropContext>
          )}
        </CardContent>
      </Card>
      {selectedTodo && (
        <TodoModal todo={selectedTodo} lastPlace={computeLastPlace()} closeModal={handleCloseTodoModal} />
      )}
    </>
  );
};

export default Todos;
