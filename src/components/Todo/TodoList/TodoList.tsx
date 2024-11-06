import { useContext } from 'react';
import { Todo } from '../../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { TodosContext } from '../../../context/TodoContext';

export const TodoList = ({ todos }: { todos: Todo[] }) => {
  const { tempTodo } = useContext(TodosContext);

  return (
    <>
      <section className="todoapp__main" data-cy="TodoList">
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </section>
      {tempTodo && (
        <TodoItem todo={tempTodo} key={tempTodo.id} isLoading={true} />
      )}
    </>
  );
};
