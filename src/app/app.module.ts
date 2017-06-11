import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { createStore, Store } from '@ailurus/ts-redux';
import { State, Actions, reducer } from 'todomvc-ts-redux/states';
import { AppComponent } from './app.component';
import { FilterPipe } from './filter.pipe';

@NgModule({
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        FormsModule
    ],
    declarations: [
        AppComponent,
        FilterPipe
    ],
    providers: [
        {
            provide: Store,
            useValue: createStore<State, Actions>(reducer)
        }
    ]
})
export class AppModule { }
