import { ReducerBuilder } from '@ailurus/ts-redux';
import { Todo } from 'todomvc-ts-redux/models';

export interface TodosState extends Array<Todo> {}

export interface TodosActions {
    'TODO_ADD': { text: string };
    'TODO_REMOVE': number;
    'TODO_TOGGLE': { id?: number, completed?: boolean };
    'TODO_EDIT': { id: number, editing?: boolean };
    'TODO_UPDATE': { id: number, text: string };
    'TODO_CLEAN': undefined;
}

let id = 0;
export const todo = new ReducerBuilder<Todo, TodosActions>()
    .case('TODO_ADD', (state, payload) => ({
        id: id++,
        text: payload.text,
        completed: false,
        editing: false
    }))
    .case('TODO_TOGGLE', (state, payload) => {
        let completed = payload.completed !== undefined
            ? payload.completed
            : !state.completed;

        let apply = payload.id !== undefined
            ? state.id === payload.id
            : true;

        return {
            ...state,
            completed: apply ? completed : state.completed
        }
    })
    .case('TODO_EDIT', (state, payload) => {
        let editing = payload.editing !== undefined
            ? payload.editing
            : !state.editing;

        return {
            ...state,
            editing: payload.id === state.id ? editing : state.editing
        }
    })
    .case('TODO_UPDATE', (state, payload) => ({
        ...state,
        text: payload.id === state.id ? payload.text : state.text
    }))
    .build();

export const todos = new ReducerBuilder<TodosState, TodosActions>()
    .init([])
    .case('TODO_ADD', (state, payload, action) => [
        ...state,
        todo({} as Todo, action)
    ])
    .case('TODO_REMOVE', (state, payload) => {
        return state.filter(todo => todo.id !== payload);
    })
    .case('TODO_TOGGLE', (state, payload, action) => {
        return state.map(t => todo(t, action));
    })
    .case('TODO_EDIT', (state, payload, action) => {
        return state.map(t => todo(t, action));
    })
    .case('TODO_UPDATE', (state, payload, action) => {
        return state.map(t => todo(t, action));
    })
    .case('TODO_CLEAN', state => {
        id = 0;
        return state.filter(todo => !todo.completed);
    })
    .build();
