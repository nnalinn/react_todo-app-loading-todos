import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
// eslint-disable-next-line
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';

type FilteredTodo = 'All' | 'Active' | 'Completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filtered, setFiltered] = useState<FilteredTodo>('All');

  useEffect(() => {
    const loadTodos = () => {
      setIsLoading(true);
      setErrorMessage(null);

      getTodos()
        .then(data => {
          setTodos(data);
        })
        .catch(() => {
          setErrorMessage('Unable to load todos');
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    loadTodos();
  }, []);

  const visibleTodos = (() => {
    switch (filtered) {
      case 'Active':
        return todos.filter(td => !td.completed);
      case 'Completed':
        return todos.filter(td => td.completed);
      default:
        return todos;
    }
  })();

  const uncompletedTodos = todos.filter(td => !td.completed).length;

  const changeVisibleTodos = (filterType: FilteredTodo) => {
    setFiltered(filterType);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const changeError = (error: string) => {
    setErrorMessage(error);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header changeError={changeError} />

        {!isLoading && <TodoList todos={visibleTodos} />}

        {todos.length && (
          <Footer
            changeVisibleTodos={changeVisibleTodos}
            filtered={filtered}
            uncompletedTodos={uncompletedTodos}
          />
        )}
      </div>
      <ErrorNotification
        errorMessage={errorMessage}
        changeError={changeError}
      />
    </div>
  );
};
