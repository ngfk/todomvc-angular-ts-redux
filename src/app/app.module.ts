import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';

import { AppComponent } from './app.component';
import { StoreService } from 'app/services';
import { FilterPipe } from 'app/pipes';

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
        // Ensures that the same store is used on hmr updates.
        process.env.NODE_ENV === 'production'
            ? StoreService
            : StoreService.devProvider
    ]
})
export class AppModule {

    constructor(
        private appRef: ApplicationRef,
        private store: StoreService) { }

    public hmrOnInit(data: any) {
        if (!data || !data.state)
            return;

        this.store.purge(data.state);
        if (data.restoreInputValues)
            data.restoreInputValues();

        this.appRef.tick();
        delete data.state;
        delete data.restoreInputValues;
    }

    public hmrOnDestroy(data: any) {
        const cmpLocations = this.appRef.components.map(cmp => cmp.location.nativeElement);

        data.state = this.store.getState();
        data.disposeOldHosts = createNewHosts(cmpLocations);
        data.restoreInputValues = createInputTransfer();
        removeNgStyles();
    }

    public hmrAfterDestroy(data: any) {
        data.disposeOldHosts();
        delete data.disposeOldHosts;
    }
}
