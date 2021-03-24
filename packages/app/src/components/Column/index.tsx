import React from "react";
import { Card, CardHeader, CardContent } from "@material-ui/core";
import { Droppable } from "react-beautiful-dnd";

import { Todo } from "@app/Types/Todo";
import TodoList from "@app/components/TodoList";

export interface Props {
  title: string;
  todos: Todo[];
  onClick: (todo: Todo, index: number) => void;
}

const Column = ({ title, todos, onClick }: Props) => {
  return (
    <Droppable droppableId={title}>
      {(provided) => (
        <Card>
          <CardHeader
            title={title}
            titleTypographyProps={{
              component: "h2",
              variant: "h5",
            }}
          />
          <CardContent>
            <TodoList provided={provided} todos={todos} onClick={onClick} />
          </CardContent>
        </Card>
      )}
    </Droppable>
  );
};

export default Column;
