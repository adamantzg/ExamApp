import { Component } from '@angular/core';
import { BroadcastService, MsalService } from '@azure/msal-angular';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent  {

  constructor(private broadcastService: BroadcastService,
    private msalService: MsalService, private commonService: CommonService,
    private router: Router) {
    
    this.broadcastService.subscribe("msal:loginSuccess", () => {
      // do something here
      this.router.navigate(['home']);
    });

   }

   errorMessage = '';

  login(): void {
    this.msalService.loginPopup().catch(
      err => this.errorMessage = this.commonService.getError(err)
    )
  }

}
