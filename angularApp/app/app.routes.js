import { RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MsalGuard } from '@azure/msal-angular';
export const routes = [
    { path: 'home', component: HomeComponent, canActivate: [MsalGuard] },
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' }
];
export const AppRoutes = RouterModule.forRoot(routes);
//# sourceMappingURL=app.routes.js.map