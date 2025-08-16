import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { ShellComponent } from './app/shell/shell.component';


bootstrapApplication(ShellComponent, {
  providers: [
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
});
