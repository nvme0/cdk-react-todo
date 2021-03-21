export interface Todo {
  id: string;
  clientId?: string;
  title: string;
  description: string;
  stage: "TODO" | "DOING" | "DONE";
  place: number;
}
