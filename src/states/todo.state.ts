import { ReducerBuilder, createReducer } from '@ailurus/ts-redux';
import { Todo } from 'app/models';

export interface TodosActions {
    'TODO_ADD':    { id: string, text: string };
    'TODO_REMOVE': { id: string };
    'TODO_TOGGLE': { id?: string, completed?: boolean };
    'TODO_EDIT':   { id: string, editing?: boolean };
    'TODO_UPDATE': { id: string, text: string };
    'TODO_CLEAN':  undefined;
}

export const todo = new ReducerBuilder<Todo, TodosActions>()
    .case('TODO_ADD', (state, payload) => ({
        ...payload,
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

export const todos = createReducer<Todo[], TodosActions>([], {
    'TODO_ADD': (state, payload, action) => [
        ...state,
        todo({} as Todo, action)
    ],
    'TODO_REMOVE': (state, payload) => {
        return state.filter(todo => todo.id !== payload.id);
    },
    'TODO_TOGGLE': (state, payload, action) => {
        return state.map(t => todo(t, action));
    },
    'TODO_EDIT': (state, payload, action) => {
        return state.map(t => todo(t, action));
    },
    'TODO_UPDATE': (state, payload, action) => {
        return state.map(t => todo(t, action));
    },
    'TODO_CLEAN': state => {
        return state.filter(todo => !todo.completed);
    }
});
