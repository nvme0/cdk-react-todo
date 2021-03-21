export interface Todo {
  id: string;
  title: string;
  description: string;
  status: "TODO" | "DOING" | "DONE";
  rank: number;
}
