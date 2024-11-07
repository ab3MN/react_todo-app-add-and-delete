import { FC, useContext, useState } from 'react';
import { Todo } from '../../../types/Todo';
import cn from 'classnames';
import { TodosContext } from '../../../context/TodoContext';

interface IProps {
  todo: Todo;
  isLoading?: boolean;
}

export const TodoItem: FC<IProps> = ({ todo, isLoading = false }) => {
  const [isDeleting, setDeliting] = useState(false);
  const { deleteTodo, onFocus } = useContext(TodosContext);

  const handleDeleteTodo = async (id: number) => {
    setDeliting(true);

    await deleteTodo(id);

    setDeliting(false);

    onFocus();
  };

  const { completed, id, title } = todo;

  return (
    <div data-cy="Todo" className={cn('todo', { completed })}>
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {}}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title.trim()}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(id)}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading || isDeleting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
