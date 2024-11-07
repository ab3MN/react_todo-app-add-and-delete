import {
  ChangeEvent,
  FormEvent,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';
import { TodoErrors } from '../../../utils/enums/TodoErrors';
import { isOnlyWhiteSpace } from '../../../utils/string/isOnlyWhiteSpace';
import { TodosContext } from '../../../context/TodoContext';

export const TodoForm = () => {
  const [title, setTitle] = useState('');
  const [isInputDisabled, setInputDisabled] = useState(false);
  const { addTodo, showError, inputRef, onFocus } = useContext(TodosContext);

  useLayoutEffect(() => {
    !isInputDisabled && onFocus();
  }, [isInputDisabled]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title || isOnlyWhiteSpace(title)) {
      showError(TodoErrors.title);
      return;
    }

    setInputDisabled(true);

    try {
      await addTodo(title.trim());
      setTitle('');
    } catch {
      showError(TodoErrors.add);
    } finally {
      setInputDisabled(false);
    }
  };

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        ref={inputRef}
        disabled={isInputDisabled}
        onChange={handleChangeTitle}
      />
    </form>
  );
};
