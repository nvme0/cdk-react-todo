export type Stage = "TODO" | "DOING" | "DONE";

export interface Todo {
  id: string;
  clientId?: string;
  title: string;
  description: string;
  stage: Stage;
  place: number;
}

export interface TodoMap {
  TODO: Todo[];
  DOING: Todo[];
  DONE: Todo[];
}
