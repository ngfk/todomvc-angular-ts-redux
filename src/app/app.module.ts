import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { State, Actions, reducer } from 'app/states';
import { StoreService } from 'app/services';
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
        StoreService
    ]
})
export class AppModule { }
