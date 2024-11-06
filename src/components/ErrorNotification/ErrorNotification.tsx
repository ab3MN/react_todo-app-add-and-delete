import { useContext } from 'react';
import { getTodoErrorsMessage } from '../../utils/todos/getTodoErrorsMessage';
import cn from 'classnames';
import { TodosContext } from '../../context/TodoContext';

export const ErrorNotification = () => {
  const { error } = useContext(TodosContext);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !error,
      })}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {error && getTodoErrorsMessage(error)}
    </div>
  );
};
