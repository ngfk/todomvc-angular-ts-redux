import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Todo, Filter } from 'todomvc-ts-redux/models';
import { State, Actions } from 'todomvc-ts-redux/states';
import { Store } from '@ailurus/ts-redux';

@Component({
    selector: 'todomvc-ts-redux',
    templateUrl: './app.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {

    public todos: Todo[];
    public currentFilter: Filter;
    public input: string = '';
    public Filter = Filter;

    private id: number;
    private unsubscribe: any;

    constructor(
        private cd: ChangeDetectorRef,
        private store: Store<State, Actions>) { }

    private get allChecked(): boolean {
        return this.todos.every(todo => todo.completed);
    }

    private get activeCount(): number {
        return this.todos.filter(todo => !todo.completed).length;
    }

    private get completedCount(): number {
        return this.todos.filter(todo => todo.completed).length;        
    }

    public ngOnInit(): void {
        const sync = (state: State): void => {
            this.todos  = state.todos;
            this.currentFilter = state.filter;
        };

        sync(this.store.getState());
        this.id = this.todos.length > 0 ? Math.max(...this.todos.map(t => t.id)) : 0;
        this.unsubscribe = this.store.subscribe(() => {
            sync(this.store.getState());
            this.cd.markForCheck();
        });
    }

    public ngOnDestroy(): void {
        this.unsubscribe();
    }

    public add() {
        if (this.input) {
            this.store.action('TODO_ADD').dispatch({
                id: ++this.id,
                text: this.input
            });
            this.input = '';
        }
    }

    public toggleAll(completed: boolean): void {
        this.store.action('TODO_TOGGLE').dispatch({ completed });
    }

    public toggle(todo: Todo): void {
        this.store.action('TODO_TOGGLE').dispatch({ id: todo.id });
    }

    public edit(todo: Todo): void {
        this.store.action('TODO_EDIT').dispatch({ id: todo.id });
    }

    public remove(todo: Todo): void {
        this.store.action('TODO_REMOVE').dispatch(todo.id);
    }

    public update(todo: Todo, text: string) {
        this.store.action('TODO_UPDATE').dispatch({ id: todo.id, text });
    }

    public setFilter(filter: Filter) {
        this.store.action('FILTER_SET').dispatch(filter);
    }

    public removeCompleted() {
        this.store.action('TODO_CLEAN').dispatch(undefined);
    }
}
