/* eslint-disable */
import './styles.scss';
import 'zone.js';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// import { platformBrowser } from '@angular/platform-browser';
import 'jquery/dist/jquery';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';

if (environment.production) {
    enableProdMode();
  }


// Styles.
// Enables Hot Module Replacement.
declare var module: any;

if (module.hot) {
    module.hot.accept();
}

platformBrowserDynamic().bootstrapModule(AppModule);
