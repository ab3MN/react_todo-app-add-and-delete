import { createContext, useState, ReactNode, useMemo, useRef } from 'react';
import { TodoErrors } from '../utils/enums/TodoErrors';
import { Todo } from '../types/Todo';
import * as todoApi from '../api/todos';
import {
  getCompletedTodos,
  getInCompletedTodos,
} from '../utils/todos/getTodos';
import { revomesTodosById } from '../utils/todos/removeTodos';

interface ITodosContext {
  todos: Todo[];
  error: TodoErrors | null;
  tempTodo: Todo | null;
  inputRef: React.RefObject<HTMLInputElement> | null;

  onFocus: () => void;
  fetchTodos: () => void;
  addTodo: (title: string) => Promise<Todo | void>;
  deleteTodo: (todoId: number) => Promise<number | void>;
  deleteCompletedTodos: () => Promise<void>;
  showError: (err: TodoErrors) => void;
}

export const TodosContext = createContext<ITodosContext>({
  todos: [],
  error: null,
  tempTodo: null,
  inputRef: null,

  fetchTodos: () => {},
  addTodo: async () => Promise.resolve(),
  deleteTodo: async () => Promise.resolve(),
  deleteCompletedTodos: async () => Promise.resolve(),
  showError: () => {},
  onFocus: () => {},
});

export const TodosProvider = ({
  children,
}: {
  children: ReactNode;
}): ReactNode => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<TodoErrors | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const showError = (err: TodoErrors) => {
    setError(err);
    setTimeout(() => setError(null), 3000);
  };

  const onFocus = () =>
    inputRef && inputRef!.current && inputRef.current.focus();

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

  const deleteTodo = async (todoId: number): Promise<number | void> => {
    try {
      await todoApi.deleteTodo(todoId);
      setTodos(currentTodo => currentTodo.filter(({ id }) => id !== todoId));

      return todoId;
    } catch {
      showError(TodoErrors.delete);
    }
  };

  const deleteCompletedTodos = async () => {
    const completedTodos = getCompletedTodos(todos);

    const todoIds = await Promise.all(
      completedTodos.map(({ id }) => deleteTodo(id)),
    );

    const validTodoIds = todoIds.filter(id => id !== undefined);

    !!validTodoIds.length && setTodos(revomesTodosById(todos, validTodoIds));
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
      deleteCompletedTodos,
      inputRef,
      onFocus,
    }),
    [todos, error, tempTodo, inputRef],
  );

  return (
    <TodosContext.Provider value={store}>{children}</TodosContext.Provider>
  );
};
