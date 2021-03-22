import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Card, CardContent, CardHeader, Typography, Grid } from "@material-ui/core";
import { Todo } from "@app/Types/Todo";

export interface TodoProps {
  todo: Todo;
  index: number;
  onClick: (todo: Todo, index: number) => void;
}

const TodoItem = ({ todo, index, onClick }: TodoProps) => {
  const { id, title, description } = todo;
  const handleOnClick = () => onClick(todo, index);

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <Grid
          item
          xs={12}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={handleOnClick}
        >
          <Card>
            <CardHeader
              title={title}
              titleTypographyProps={{
                component: "h3",
                variant: "h6",
              }}
            />
            <CardContent>
              <Typography variant="body1">{description}</Typography>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Draggable>
  );
};

export default TodoItem;
