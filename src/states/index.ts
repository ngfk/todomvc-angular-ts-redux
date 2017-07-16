import { combineReducers } from '@ailurus/ts-redux';
import { Filter, Todo } from 'app/models';
import { FilterActions, filter } from './filter.state';
import { TodosActions, todos } from './todo.state';

export * from './filter.state';
export * from './todo.state';

export interface State {
    readonly filter: Filter;
    readonly todos: Todo[];
}

export interface Actions extends
    FilterActions, 
    TodosActions {}

export const reducer = combineReducers<State>({
    filter,
    todos
});
