export interface Todo {
  id: string;
  title: string;
  description: string;
  stage: "TODO" | "DOING" | "DONE";
  place: number;
}
