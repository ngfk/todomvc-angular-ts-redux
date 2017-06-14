import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Store } from '@ailurus/ts-redux';
import { State, Actions, reducer} from 'app/states';

export class StoreService extends Store<State, Actions> {

    public stateStream: Observable<State>;
    private stateSubj: BehaviorSubject<State>;

    constructor() {
        super(reducer);

        // Link Redux store subscription to custom states Observable
        this.stateSubj   = new BehaviorSubject<State>(this.getState());
        this.stateStream = this.stateSubj.asObservable();
        super.subscribe(() => this.stateSubj.next(this.getState()));
    }

    public select<T>(selector: (state: State) => T): Observable<T> {
        return this.stateStream.map(selector).distinctUntilChanged();
    }
}
