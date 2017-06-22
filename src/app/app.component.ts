import { Observable } from 'rxjs/Rx';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Todo, Filter } from 'app/models';
import { StoreService } from 'app/services';

@Component({
    selector: 'app',
    templateUrl: './app.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

    public todosStream: Observable<Todo[]>;
    public currentFilterStream: Observable<Filter>;

    public input: string = '';
    public Filter = Filter;

    private id = 0;

    constructor(private store: StoreService) {
        this.todosStream = this.store.select(state => state.todos);
        this.currentFilterStream = this.store.select(state => state.filter);
    }

    public add() {
        if (this.input) {
            this.store.action('TODO_ADD').dispatch({ id: this.id++, text: this.input });
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
        this.store.action('TODO_REMOVE').dispatch(todo.id);
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
