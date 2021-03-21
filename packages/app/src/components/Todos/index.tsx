import React from "react";
import { Card, CardHeader, CardContent } from "@material-ui/core";
import { DragDropContext, Droppable, DropResult, ResponderProvided } from "react-beautiful-dnd";
import { useQuery } from "react-query";
import useStyles from "./styles";
import TodoList from "@app/components/TodoList";
import listTodos from "@app/api/todos/list";
import wrapAsyncWithToastr from "@app/utils/wrapAsyncWithToastr";
import { Todo } from "@app/Types/Todo";
import CircularProgressCentered from "@app/components/CircularProgressCentered";

const Todos = () => {
  const classes = useStyles();

  const { isLoading, data, refetch } = useQuery("todos", () =>
    wrapAsyncWithToastr(async () => listTodos(), { successMessage: "Loaded Todos" }),
  );
  const todos = (data || []) as Todo[];

  const handleOnDragEnd = (result: DropResult, provided: ResponderProvided) => {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // updateTodos(items);
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
            <Droppable droppableId="todos">{(provided) => <TodoList provided={provided} todos={todos} />}</Droppable>
          </DragDropContext>
        )}
      </CardContent>
    </Card>
  );
};

export default Todos;
