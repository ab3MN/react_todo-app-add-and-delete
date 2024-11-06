import {
  ChangeEvent,
  FormEvent,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { TodoErrors } from '../../../utils/enums/TodoErrors';
import { isOnlyWhiteSpace } from '../../../utils/string/isOnlyWhiteSpace';
import { TodosContext } from '../../../context/TodoContext';

export const TodoForm = () => {
  const [title, setTitle] = useState('');
  const [isInputDisabled, setInputDisabled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addTodo, showError } = useContext(TodosContext);

  useLayoutEffect(() => {
    if (inputRef.current && !isInputDisabled) {
      inputRef.current.focus();
    }
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
    // addTodo(title.trim())
    //   .then(() => {
    //     setTitle('');
    //   })
    //   .catch(() => {
    //     showError(TodoErrors.add);
    //   })
    //   .finally(() => {
    //     setInputDisabled(false);
    //   });
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
