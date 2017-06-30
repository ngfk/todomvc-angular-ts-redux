import { Observable } from 'rxjs/Rx';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import * as uuid from 'uuid';

import { Todo, Filter } from 'app/models';
import { StoreService } from 'app/services';

@Component({
    selector: 'app',
    templateUrl: './app.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

    public todos$: Observable<Todo[]>;
    public filter$: Observable<Filter>;

    public input = '';
    public Filter = Filter;

    constructor(private store: StoreService) {
        this.todos$  = this.store.select(state => state.todos);
        this.filter$ = this.store.select(state => state.filter);
    }

    public add() {
        if (this.input) {
            this.store.action('TODO_ADD').dispatch({ id: uuid.v4(), text: this.input });
            this.input = '';
        }
    }

    public toggleAll(completed: boolean): void {
        this.store.action('TODO_TOGGLE').dispatch({ completed });
    }

    public toggle(todo: Todo): void {
        this.store.action('TODO_TOGGLE').dispatch({ id: todo.id });
    }

    public edit(event: KeyboardEvent | FocusEvent | MouseEvent, todo: Todo): void {
        this.store.action('TODO_EDIT').dispatch({ id: todo.id });
    }

    public remove(todo: Todo): void {
        this.store.action('TODO_REMOVE').dispatch({ id: todo.id });
    }

    public update(event: KeyboardEvent | FocusEvent, todo: Todo, text: string) {
        this.store.action('TODO_UPDATE').dispatch({ id: todo.id, text });
        this.edit(event, todo);
        event.stopPropagation();
    }

    public setFilter(filter: Filter) {
        this.store.action('FILTER_SET').dispatch(filter);
    }

    public removeCompleted() {
        this.store.action('TODO_CLEAN').dispatch(undefined);
    }

    public getAllChecked(todos: Todo[]): boolean {
        return todos.every(todo => todo.completed);
    }

    public getActiveCount(todos: Todo[]): number {
        return todos.filter(todo => !todo.completed).length;
    }

    public getCompletedCount(todos: Todo[]): number {
        return todos.filter(todo => todo.completed).length;        
    }
}
