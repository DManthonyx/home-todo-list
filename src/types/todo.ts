export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
  dueDate: Date;
}
