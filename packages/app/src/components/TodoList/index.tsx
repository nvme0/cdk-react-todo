import React from "react";
import { Grid } from "@material-ui/core";
import { DroppableProvided } from "react-beautiful-dnd";
import { Todo } from "@app/Types/Todo";
import TodoItem from "@app/components/TodoItem";

interface TodoListProps {
  todos: Todo[];
  provided: DroppableProvided;
}

const TodoList = ({ provided, todos }: TodoListProps) => {
  return (
    <Grid container spacing={2} className="todos" {...provided.droppableProps} ref={provided.innerRef}>
      {todos.map((todo, index) => (
        <TodoItem key={todo.id} todo={todo} index={index} />
      ))}
      {provided.placeholder}
    </Grid>
  );
};

export default TodoList;
