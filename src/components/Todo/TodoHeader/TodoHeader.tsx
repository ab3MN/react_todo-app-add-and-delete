import { FC } from 'react';
import { Todo } from '../../../types/Todo';
import { isAllTodosCompleted } from '../../../utils/todos/getTodos';
import { TodoForm } from '../TodoForm/TodoForm';

interface TodoHeader {
  todos: Todo[];
}

export const TodoHeader: FC<TodoHeader> = ({ todos }) => {
  return (
    <header className="todoapp__header">
      {isAllTodosCompleted(todos) && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <TodoForm />
    </header>
  );
};
