import { createContext, useState, ReactNode, useMemo } from 'react';
import { TodoErrors } from '../utils/enums/TodoErrors';
import { Todo } from '../types/Todo';
import * as todoApi from '../api/todos';

interface ITodosContext {
  todos: Todo[];
  fetchTodos: () => void;
  addTodo: (title: string) => Promise<Todo | void>;
  deleteTodo: (todoId: number) => Promise<void>;
  error: TodoErrors | null;
  showError: (err: TodoErrors) => void;
  tempTodo: Todo | null;
}

export const TodosContext = createContext<ITodosContext>({
  todos: [],
  error: null,
  tempTodo: null,
  fetchTodos: () => {},
  addTodo: async () => Promise.resolve(),
  deleteTodo: async () => Promise.resolve(),
  showError: () => {},
});

export const TodosProvider = ({
  children,
}: {
  children: ReactNode;
}): ReactNode => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<TodoErrors | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const showError = (err: TodoErrors) => {
    setError(err);
    setTimeout(() => setError(null), 3000);
  };

  const fetchTodos = async () => {
    try {
      const data = await todoApi.getTodos();
      setTodos(data);
    } catch {
      showError(TodoErrors.load);
    }
  };

  const addTodo = async (title: string): Promise<Todo | void> => {
    try {
      const todo = {
        title,
        userId: todoApi.USER_ID,
        completed: false,
      };

      setTempTodo({ ...todo, id: 0 });

      const newTodo = await todoApi.addTodo(todo);

      setTodos(prevState => [...prevState, newTodo]);
      setTempTodo(null);
    } catch (err) {
      showError(TodoErrors.add);
      setTempTodo(null);
      throw err;
    }
  };

  const deleteTodo = async (todoId: number) => {
    try {
      await todoApi.deleteTodo(todoId);
      setTodos(currentTodo => currentTodo.filter(({ id }) => id !== todoId));
    } catch {
      showError(TodoErrors.delete);
    }
  };

  const store = useMemo(
    () => ({
      todos,
      fetchTodos,
      addTodo,
      deleteTodo,
      error,
      showError,
      tempTodo,
    }),
    [todos, error, tempTodo],
  );

  return (
    <TodosContext.Provider value={store}>{children}</TodosContext.Provider>
  );
};
