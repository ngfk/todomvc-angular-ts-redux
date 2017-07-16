import 'todomvc-app-css/index';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { bootloader } from '@angularclass/hmr';

import { AppModule } from './app/app.module';

const isProd = process.env.NODE_ENV === 'production';

const bootstrap = () => {
    platformBrowserDynamic().bootstrapModule(AppModule);
};

if (isProd) {
    enableProdMode();
    document.addEventListener('DOMContentLoaded', bootstrap);
}
else
    bootloader(bootstrap);
