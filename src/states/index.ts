import { combineReducers } from '@ailurus/ts-redux';
import * as Models from 'app/models';
import { FilterActions, filter } from './filter.state';
import { TodosActions, todos } from './todo.state';

export * from './filter.state';
export * from './todo.state';

export interface State {
    readonly filter: Models.Filter;
    readonly todos: Models.Todo[];
}

export interface Actions extends
    FilterActions, 
    TodosActions {}

export const reducer = combineReducers<State>({
    filter,
    todos
});
