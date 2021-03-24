import { DropResult } from "react-beautiful-dnd";
import { Todo, Stage, TodoMap } from "@app/Types/Todo";

const removeFromSource = (items: Todo[], index: number) => {
  const [reorderedItem] = items.splice(index, 1);
  return reorderedItem;
};

const insertToDestination = (items: Todo[], index: number, item: Todo) => items.splice(index, 0, item);

const updateItems = (items: Todo[], stage: Stage) =>
  items.map((item, index) => ({
    ...item,
    stage,
    place: index,
  }));

interface GetChangedTodosProps {
  todos: Todo[];
  sourceItems: Todo[];
  sourceId: string;
  destinationItems: Todo[];
  destinationId: string;
}

const getChangedTodos = ({ todos, sourceItems, sourceId, destinationItems, destinationId }: GetChangedTodosProps) => {
  let items: Todo[] = [];

  const updatedSourceItems = updateItems(sourceItems, sourceId as Stage);
  items = [...updatedSourceItems];

  if (sourceId !== destinationId) {
    const updatedDestinationItems = updateItems(destinationItems, destinationId as Stage);
    items = [...items, ...updatedDestinationItems];
  }

  return items.filter((item) => {
    const referenceItem = todos.find(({ id }) => id === item.id);
    if (!referenceItem) return false;
    if (referenceItem.place !== item.place || referenceItem.stage !== item.stage) return true;
    return false;
  });
};

interface GetUpdatedTodoListProps {
  todos: Todo[];
  changedTodos: Todo[];
}

const getUpdatedTodoList = ({ todos, changedTodos }: GetUpdatedTodoListProps) =>
  todos.map((item) => {
    const referenceItem = changedTodos.find(({ id }) => id === item.id);
    if (!referenceItem) return item;
    else return referenceItem;
  });

export interface Props {
  result: DropResult;
  todoMap: TodoMap;
  todos: Todo[];
}

const onDragEndHandler = ({ result, todoMap, todos }: Props) => {
  if (!result.destination) return { updatedTodoList: todos, changedTodos: [] };

  const { index: sourceIndex, droppableId: sourceId } = result.source;
  const { index: destinationIndex, droppableId: destinationId } = result.destination;

  const sourceItems = Array.from<Todo>(todoMap[sourceId]).sort((a, b) => a.place - b.place);
  const destinationItems = Array.from<Todo>(todoMap[destinationId]).sort((a, b) => a.place - b.place);

  const reorderedItem = removeFromSource(sourceItems, sourceIndex);

  if (sourceId === destinationId) {
    insertToDestination(sourceItems, destinationIndex, reorderedItem);
  } else {
    insertToDestination(destinationItems, destinationIndex, reorderedItem);
  }

  const changedTodos = getChangedTodos({
    todos,
    sourceItems,
    sourceId,
    destinationItems,
    destinationId,
  });
  const updatedTodoList = getUpdatedTodoList({ todos, changedTodos });

  return {
    updatedTodoList,
    changedTodos,
  };
};

export default onDragEndHandler;
