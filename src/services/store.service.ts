import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable, FactoryProvider } from '@angular/core';
import { Store, Reducer, Action } from '@ailurus/ts-redux';

import { State, Actions, reducer } from 'app/states';

const PURGE = '@@PURGE';

let STORE_CACHE: StoreService;
export function storeFactory() {
    if (!STORE_CACHE)
        STORE_CACHE = new StoreService();
    return STORE_CACHE;
}

@Injectable()
export class StoreService extends Store<State, Actions> {

    public static devProvider: FactoryProvider = {
        provide: StoreService,
        useFactory: storeFactory,
        deps: []
    };

    public state$: Observable<State>;
    public initialState: State;

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

    public purge(state = this.initialState): void {
        this.dispatch({ type: PURGE, payload: state });
    }

    private extendReducer(red: Reducer<State>): Reducer<State> {
        return (state: State, action: Action<any>): State => {
            if (action.type === PURGE)
                return action.payload;

            return red(state, action);
        };
    }
}
