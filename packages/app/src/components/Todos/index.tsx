import React, { useState } from "react";
import { Card, CardHeader, Button, Grid } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import { DragDropContext, DropResult, ResponderProvided } from "react-beautiful-dnd";
import { useQuery } from "react-query";

import useStyles from "./styles";
import { Todo } from "@app/Types/Todo";
import { TODOS_QUERY_KEY } from "@app/constants";
import wrapAsyncWithToastr from "@app/utils/wrapAsyncWithToastr";
import createTodoMap from "@app/utils/createTodoMap";
import listTodos from "@app/api/todos/list";
import Column from "@app/components/Column";
import TodoModal from "@app/components/TodoModal";
import CircularProgressCentered from "@app/components/CircularProgressCentered";
import useBatchUpdateMutation from "@app/mutations/todos/useBatchUpdateMutation";
import onDragEndHandler from "./onDragEndHandler";

const Todos = () => {
  const classes = useStyles();
  const { mutate: batchUpdateMutation } = useBatchUpdateMutation();
  const [selectedTodo, setSelectedTodo] = useState<Partial<Todo> | null>(null);

  const { isLoading, data } = useQuery({
    queryKey: TODOS_QUERY_KEY,
    queryFn: () => wrapAsyncWithToastr(() => listTodos(), { successMessage: "Loaded Todos" }),
  });
  const todos = (data || []) as Todo[];
  const todoMap = createTodoMap(todos);

  const computeLastPlace = () => {
    const sortedTodoColumn = [...todoMap["TODO"]].sort((a, b) => a.place - b.place);
    const numberInTodo = sortedTodoColumn.length;
    if (numberInTodo === 0) {
      return -1;
    } else {
      return sortedTodoColumn[numberInTodo - 1].place;
    }
  };

  const handleOnDragEnd = (result: DropResult, provided: ResponderProvided) => {
    const { updatedTodoList, changedTodos } = onDragEndHandler({
      result,
      todoMap,
      todos,
    });

    batchUpdateMutation({
      todos: updatedTodoList,
      changedTodos: changedTodos,
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
      {isLoading ? (
        <CircularProgressCentered message="Loading..." />
      ) : (
        <>
          <Card className={classes.root}>
            <CardHeader
              className={classes.header}
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
          </Card>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Grid className={classes.columns} container spacing={2}>
              <Grid item xs={4}>
                <Column title="TODO" todos={todoMap["TODO"]} onClick={handleClickTodo} />
              </Grid>
              <Grid item xs={4}>
                <Column title="DOING" todos={todoMap["DOING"]} onClick={handleClickTodo} />
              </Grid>
              <Grid item xs={4}>
                <Column title="DONE" todos={todoMap["DONE"]} onClick={handleClickTodo} />
              </Grid>
            </Grid>
          </DragDropContext>
        </>
      )}
      {selectedTodo && (
        <TodoModal todo={selectedTodo} lastPlace={computeLastPlace()} closeModal={handleCloseTodoModal} />
      )}
    </>
  );
};

export default Todos;
