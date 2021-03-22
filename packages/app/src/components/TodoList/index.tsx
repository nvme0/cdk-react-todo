import React from "react";
import { Grid } from "@material-ui/core";
import { DroppableProvided } from "react-beautiful-dnd";
import { Todo } from "@app/Types/Todo";
import TodoItem from "@app/components/TodoItem";

interface TodoListProps {
  todos: Todo[];
  provided: DroppableProvided;
  onClick: (todo: Todo, index: number) => void;
}

const TodoList = ({ provided, todos, onClick }: TodoListProps) => {
  return (
    <Grid container spacing={2} className="todos" {...provided.droppableProps} ref={provided.innerRef}>
      {todos
        .sort((a, b) => a.place - b.place)
        .map((todo, index) => (
          <TodoItem key={todo.id} todo={todo} index={index} onClick={onClick} />
        ))}
      {provided.placeholder}
    </Grid>
  );
};

export default TodoList;
