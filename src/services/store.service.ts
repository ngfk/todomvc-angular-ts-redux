import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Store } from '@ailurus/ts-redux';
import { State, Actions, reducer} from 'app/states';

export class StoreService extends Store<State, Actions> {

    public state$: Observable<State>;
    private stateSubj: BehaviorSubject<State>;

    constructor() {
        super(
            reducer,
            undefined,
            (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
        );

        // Link Redux store subscription to custom state stream
        this.stateSubj = new BehaviorSubject<State>(this.getState());
        this.state$    = this.stateSubj.asObservable();
        super.subscribe(() => this.stateSubj.next(this.getState()));
    }

    public select<T>(selector: (state: State) => T): Observable<T> {
        return this.state$.map(selector).distinctUntilChanged();
    }
}
