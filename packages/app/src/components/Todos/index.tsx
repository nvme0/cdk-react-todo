import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@material-ui/core";
import { DragDropContext, Droppable, DropResult, ResponderProvided } from "react-beautiful-dnd";
import useStyles from "./styles";
import { Todo } from "@app/Types/Todo";
import TodoList from "@app/components/TodoList";

const mockTodos: Todo[] = [
  {
    id: "1",
    title: "Clean Room",
    description: "Clothes everywhere!",
    status: "TODO",
  },
  {
    id: "2",
    title: "Wash Dishes",
    description: "Wash dirty dishes in the sink",
    status: "TODO",
  },
];

const Todos = () => {
  const classes = useStyles();
  const [todos, updateTodos] = useState(mockTodos);

  const handleOnDragEnd = (result: DropResult, provided: ResponderProvided) => {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateTodos(items);
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
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="todos">{(provided) => <TodoList provided={provided} todos={todos} />}</Droppable>
        </DragDropContext>
      </CardContent>
    </Card>
  );
};

export default Todos;
