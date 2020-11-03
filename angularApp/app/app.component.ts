import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { BroadcastService, MsalService } from '@azure/msal-angular';
import { Logger, CryptoUtils, Account } from 'msal';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';
import { User } from './domainclasses';

@Component({
    selector: 'app-component',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class AppComponent implements OnInit {

    // loggedIn = false;
    account: Account = null;
    user: User;

    constructor(private broadcastService: BroadcastService,
        private authService: MsalService, private router: Router,
        private userService: UserService) {
            
    }

    ngOnInit(): void {
        this.checkoutAccount();

        this.broadcastService.subscribe('msal:loginSuccess', () => {
            this.checkoutAccount();            
        });

        this.broadcastService.subscribe('msal:loginFailure', () => {
          
        });

        this.broadcastService.subscribe("msal:acquireTokenFailure", () => {
          // do something here
          /*const accessTokenRequest = {
            scopes: ["user.read"]
          }
          this.authService.acquireTokenPopup(accessTokenRequest);*/
        });

        this.authService.handleRedirectCallback((authError, response) => {
        if (authError) {
            console.error('Redirect Error: ', authError.errorMessage);
            return;
        }

        console.log('Redirect Success: ', response.accessToken);
        });

        this.authService.setLogger(new Logger((_logLevel, message, _piiEnabled) => {
        console.log('MSAL Logging: ', message);
        }, {
        correlationId: CryptoUtils.createNewGuid(),
        piiLoggingEnabled: false
        }));
    }

    checkoutAccount() {
        // this.loggedIn = !!this.authService.getAccount();
        this.account = this.authService.getAccount();
        if(this.account && !this.user) {
          this.userService.getCurrentUser().subscribe(
            (u) => this.user = u
          );
        }
      }
    
      login() {
        const isIE = window.navigator.userAgent.includes('MSIE ') || window.navigator.userAgent.includes('Trident/');
    
        if (isIE) {
          this.authService.loginRedirect();
        } else {
          this.authService.loginPopup().then(
              () => {
                this.userService.saveUser();                
                this.router.navigate(['home']);
              } 
          );
        }
      }
    
      logout() {
        this.userService.removeUser();
        this.authService.logout();        
      }
 }
