import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { StoreService } from 'app/services';
import { FilterPipe }   from 'app/pipes';
import { AppComponent } from './app.component';

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
