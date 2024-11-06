/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */

import { useContext, useLayoutEffect, useMemo, useState } from 'react';
import { FilterStatuses } from '../../utils/enums/FilterStatuses';
import { getFiltredTodo } from '../../utils/todos/filterTodo';
import { TodoHeader } from './TodoHeader/TodoHeader';
import { TodoList } from './TodoList/TodoList';
import { TodoFooter } from './TodoFooter/TodoFooter';
import { ErrorNotification } from '../ErrorNotification/ErrorNotification';
import { TodosContext } from '../../context/TodoContext';

export const Todos: React.FC = () => {
  const { fetchTodos, todos } = useContext(TodosContext);

  const [status, setStatus] = useState<FilterStatuses>(FilterStatuses.All);

  const filtredTodos = useMemo(
    () => getFiltredTodo(todos, status),
    [status, todos],
  );

  useLayoutEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader todos={todos} />

        <TodoList todos={filtredTodos} />

        {!!todos.length && (
          <TodoFooter todos={todos} setStatus={setStatus} status={status} />
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};
